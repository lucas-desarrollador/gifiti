import { Request, Response } from 'express';
import { google } from 'googleapis';

// Configuración de Google OAuth
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const exchangeCodeForToken = async (req: Request, res: Response) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código de autorización requerido' });
    }

    // Intercambiar código por token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.json({
      success: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token
    });

  } catch (error) {
    console.error('Error al intercambiar código por token:', error);
    res.status(500).json({ 
      error: 'Error al procesar la autenticación con Google' 
    });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Token de acceso requerido' });
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    // Obtener información del usuario
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    res.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
        given_name: data.given_name,
        family_name: data.family_name
      }
    });

  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener información del usuario' 
    });
  }
};

export const checkUserExists = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    // Aquí deberías verificar en tu base de datos si el usuario existe
    // Por ahora simulamos la verificación
    const userExists = false; // TODO: Implementar verificación real en la base de datos

    res.json({ exists: userExists });

  } catch (error) {
    console.error('Error al verificar usuario:', error);
    res.status(500).json({ 
      error: 'Error al verificar usuario' 
    });
  }
};
