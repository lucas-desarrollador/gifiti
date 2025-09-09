import api, { handleApiResponse, handleApiError } from './api';
import { User, LoginForm, RegisterForm, ApiResponse } from '../types';

export class AuthService {
  // Login de usuario
  static async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/login',
        credentials
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Registro de usuario
  static async register(userData: RegisterForm): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/register',
        userData
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Incluso si hay error, limpiamos el localStorage
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Verificar token y obtener usuario actual
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Refrescar token
  static async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Cambiar contraseña
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Solicitar reset de contraseña
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Reset de contraseña con token
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }
}
