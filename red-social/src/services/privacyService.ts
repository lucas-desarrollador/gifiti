import api from './api';

export interface PrivacySettings {
  id?: number;
  userId: string;
  showAge: boolean;
  showEmail: boolean;
  showAllWishes: boolean;
  showContactsList: boolean;
  showMutualFriends: boolean;
  showLocation: boolean;
  showPostalAddress: boolean;
  isPublicProfile: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const PrivacyService = {
  // Obtener configuraciones de privacidad del usuario
  async getPrivacySettings(): Promise<PrivacySettings> {
    try {
      const response = await api.get('/privacy');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener configuraciones de privacidad:', error);
      throw error;
    }
  },

  // Actualizar configuraciones de privacidad del usuario
  async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
    try {
      const response = await api.put('/privacy', settings);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar configuraciones de privacidad:', error);
      throw error;
    }
  }
};
