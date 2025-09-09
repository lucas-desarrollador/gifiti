import api, { handleApiResponse, handleApiError } from './api';
import { User, ProfileForm, PaginatedResponse } from '../types';

export class UserService {
  // Obtener perfil del usuario actual
  static async getProfile(): Promise<User> {
    try {
      const response = await api.get<{ success: boolean; data: User }>('/users/profile');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Actualizar perfil del usuario
  static async updateProfile(profileData: ProfileForm): Promise<User> {
    try {
      console.log('🔍 Intentando actualizar perfil:', profileData);
      const token = localStorage.getItem('auth_token');
      console.log('🔑 Token disponible:', !!token);
      
      const formData = new FormData();
      
      // Agregar campos de texto
      formData.append('nickname', profileData.nickname);
      formData.append('realName', profileData.realName);
      formData.append('birthDate', profileData.birthDate);
      
      if (profileData.address) {
        formData.append('address', profileData.address);
      }
      
      if (profileData.age) {
        formData.append('age', profileData.age.toString());
      }
      
      // Agregar imagen si existe
      if (profileData.profileImage) {
        formData.append('profileImage', profileData.profileImage);
      }

      console.log('📤 Enviando FormData con:', {
        nickname: profileData.nickname,
        realName: profileData.realName,
        birthDate: profileData.birthDate,
        address: profileData.address,
        age: profileData.age,
        hasImage: !!profileData.profileImage
      });

      const response = await api.put<{ success: boolean; data: User }>(
        '/users/profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('✅ Perfil actualizado exitosamente:', response.data);
      return handleApiResponse(response);
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener usuario por ID
  static async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get<{ success: boolean; data: User }>(`/users/${userId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Buscar usuarios
  static async searchUsers(query: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get<{ success: boolean; data: PaginatedResponse<User> }>(
        `/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener usuarios cercanos (para explorar)
  static async getNearbyUsers(latitude?: number, longitude?: number, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    try {
      let url = `/users/nearby?page=${page}&limit=${limit}`;
      
      if (latitude && longitude) {
        url += `&lat=${latitude}&lng=${longitude}`;
      }

      const response = await api.get<{ success: boolean; data: PaginatedResponse<User> }>(url);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Eliminar cuenta de usuario
  static async deleteAccount(): Promise<void> {
    try {
      await api.delete('/users/account');
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Subir imagen de perfil
  static async uploadProfileImage(imageFile: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post<{ success: boolean; data: { imageUrl: string } }>(
        '/users/profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }
}
