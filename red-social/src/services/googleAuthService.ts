// Servicio de autenticación con Google OAuth 2.0
// Maneja el flujo completo de login y registro con Google

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  user?: GoogleUser;
  error?: string;
  isNewUser?: boolean;
}

class GoogleAuthService {
  private clientId: string;
  private redirectUri: string;
  private scope: string;

  constructor() {
    // Client ID real de Google Cloud Console
    this.clientId = '202608487449-q8gp5ju0gl43tbhbslv3lg5i618jbd54.apps.googleusercontent.com';
    this.redirectUri = window.location.origin + '/auth/google/callback';
    this.scope = 'openid email profile';
  }

  /**
   * Inicia el flujo de autenticación con Google
   * Redirige a Google para autenticación
   */
  async authenticateWithGoogle(): Promise<GoogleAuthResponse> {
    try {
      // Crear la URL de autorización de Google
      const authUrl = this.buildAuthUrl();
      
      // Guardar el estado en localStorage para cuando regrese
      const state = this.generateState();
      localStorage.setItem('google_auth_state', state);
      
      // Redirigir a Google
      window.location.href = authUrl;
      
      // Este return nunca se ejecutará porque se redirige
      return { success: false, error: 'Redirigiendo a Google...' };

    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      return { 
        success: false, 
        error: 'Error al autenticar con Google. Por favor, intenta nuevamente.' 
      };
    }
  }

  /**
   * Procesa el callback de Google después de la redirección
   */
  async processCallback(): Promise<GoogleAuthResponse> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const state = urlParams.get('state');

      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);

      if (error) {
        return { success: false, error: `Error de Google: ${error}` };
      }

      if (!code) {
        return { success: false, error: 'No se recibió código de autorización' };
      }

      // Intercambiar código de autorización por token
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      if (!tokenResponse.success) {
        return { success: false, error: tokenResponse.error };
      }

      if (!tokenResponse.accessToken) {
        return { success: false, error: 'No se recibió token de acceso' };
      }

      // Obtener información del usuario
      const userInfo = await this.getUserInfo(tokenResponse.accessToken);
      
      if (!userInfo.success) {
        return { success: false, error: userInfo.error };
      }

      if (!userInfo.user) {
        return { success: false, error: 'No se pudo obtener información del usuario' };
      }

      // Verificar si es un usuario nuevo
      const userExists = await this.checkUserExists(userInfo.user.email);

      return {
        success: true,
        user: userInfo.user,
        isNewUser: !userExists
      };

    } catch (error) {
      console.error('Error procesando callback de Google:', error);
      return { 
        success: false, 
        error: 'Error al procesar la autenticación con Google.' 
      };
    }
  }

  /**
   * Construye la URL de autorización de Google
   */
  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scope,
      access_type: 'offline',
      prompt: 'select_account', // Fuerza la selección de cuenta
      state: this.generateState()
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Abre una ventana emergente para la autenticación
   */
  private openPopup(url: string): Window | null {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    return window.open(
      url,
      'googleAuth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  /**
   * Espera la respuesta de la ventana emergente
   */
  private waitForPopupResponse(popup: Window | null): Promise<{code?: string, error?: string, isNewUser?: boolean}> {
    return new Promise((resolve, reject) => {
      if (!popup) {
        reject(new Error('No se pudo abrir la ventana emergente'));
        return;
      }

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('El usuario cerró la ventana de autenticación'));
        }
      }, 1000);

      // Escuchar mensajes de la ventana emergente
      const messageListener = (event: MessageEvent) => {
        console.log('Mensaje recibido:', event.data);
        
        if (event.origin !== window.location.origin) {
          console.log('Origen no válido:', event.origin);
          return;
        }
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          console.log('Autenticación exitosa, código recibido:', event.data.code);
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve({
            code: event.data.code
          });
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          console.log('Error en autenticación:', event.data.error);
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve({ error: event.data.error });
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  /**
   * Intercambia el código de autorización por un token de acceso
   */
  private async exchangeCodeForToken(code: string): Promise<{success: boolean, accessToken?: string, error?: string}> {
    try {
      const response = await fetch('http://localhost:3001/api/auth/google/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirectUri: this.redirectUri })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Error al obtener token' };
      }

      return { success: true, accessToken: data.accessToken };

    } catch (error) {
      console.error('Error en exchangeCodeForToken:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  /**
   * Obtiene la información del usuario desde Google
   */
  private async getUserInfo(accessToken: string): Promise<{success: boolean, user?: GoogleUser, error?: string}> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        return { success: false, error: 'Error al obtener información del usuario' };
      }

      const userData = await response.json();
      
      const user: GoogleUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        given_name: userData.given_name,
        family_name: userData.family_name
      };

      return { success: true, user };

    } catch (error) {
      return { success: false, error: 'Error al obtener información del usuario' };
    }
  }

  /**
   * Genera un estado aleatorio para seguridad
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Verifica si el usuario ya existe en nuestro sistema
   */
  async checkUserExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:3001/api/users/check?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return false;
    }
  }
}

export const googleAuthService = new GoogleAuthService();
