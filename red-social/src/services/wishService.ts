import api, { handleApiResponse, handleApiError } from './api';
import { Wish, WishForm, PaginatedResponse } from '../types';

export class WishService {
  // Obtener deseos del usuario actual
  static async getUserWishes(): Promise<Wish[]> {
    try {
      console.log('🔍 Intentando obtener deseos del usuario...');
      const token = localStorage.getItem('auth_token');
      console.log('🔑 Token disponible:', !!token);
      
      const response = await api.get<{ success: boolean; data: Wish[] }>('/wishes');
      console.log('✅ Respuesta exitosa:', response.data);
      
      // Log detallado de las imágenes
      if (response.data.data) {
        response.data.data.forEach((wish, index) => {
          console.log(`🖼️ Deseo ${index + 1}:`, {
            id: wish.id,
            title: wish.title,
            image: wish.image,
            imageUrl: wish.image ? (wish.image.startsWith('http') ? wish.image : `http://localhost:3001${wish.image}`) : 'Sin imagen'
          });
        });
      }
      
      return handleApiResponse(response);
    } catch (error) {
      console.error('❌ Error al obtener deseos:', error);
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener deseos de un usuario específico
  static async getUserWishesById(userId: string): Promise<Wish[]> {
    try {
      const response = await api.get<{ success: boolean; data: Wish[] }>(`/wishes/user/${userId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Agregar nuevo deseo
  static async addWish(wishData: WishForm): Promise<Wish> {
    try {
      console.log('🔍 Intentando agregar deseo:', wishData);
      const token = localStorage.getItem('auth_token');
      console.log('🔑 Token disponible:', !!token);
      
      const formData = new FormData();
      
      formData.append('title', wishData.title);
      formData.append('description', wishData.description);
      
      // Siempre enviar purchaseLink, incluso si está vacío
      formData.append('purchaseLink', wishData.purchaseLink || '');
      
      if (wishData.image) {
        formData.append('image', wishData.image);
      }

      console.log('📤 Enviando FormData con:', {
        title: wishData.title,
        description: wishData.description,
        purchaseLink: wishData.purchaseLink,
        hasImage: !!wishData.image
      });

      const response = await api.post<{ success: boolean; data: Wish }>(
        '/wishes',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('✅ Deseo agregado exitosamente:', response.data);
      return handleApiResponse(response);
    } catch (error) {
      console.error('❌ Error al agregar deseo:', error);
      throw new Error(handleApiError(error as any));
    }
  }

  // Actualizar deseo existente
  static async updateWish(wishId: string, wishData: WishForm): Promise<Wish> {
    try {
      const formData = new FormData();
      
      formData.append('title', wishData.title);
      formData.append('description', wishData.description);
      
      // Siempre enviar purchaseLink, incluso si está vacío
      formData.append('purchaseLink', wishData.purchaseLink || '');
      
      if (wishData.image) {
        formData.append('image', wishData.image);
      }

      const response = await api.put<{ success: boolean; data: Wish }>(
        `/wishes/${wishId}`,
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

  // Eliminar deseo
  static async deleteWish(wishId: string): Promise<void> {
    try {
      await api.delete(`/wishes/${wishId}`);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Reordenar deseos
  static async reorderWishes(wishIds: string[]): Promise<Wish[]> {
    try {
      const response = await api.put<{ success: boolean; data: Wish[] }>(
        '/wishes/reorder',
        { wishIds }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Explorar deseos (para la sección explore)
  static async exploreWishes(
    filters?: {
      tags?: string[];
      location?: string;
      sortBy?: 'recent' | 'popular' | 'distance';
    },
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Wish>> {
    try {
      let url = `/wishes/explore?page=${page}&limit=${limit}`;
      
      if (filters?.tags && filters.tags.length > 0) {
        url += `&tags=${filters.tags.join(',')}`;
      }
      
      if (filters?.location) {
        url += `&location=${encodeURIComponent(filters.location)}`;
      }
      
      if (filters?.sortBy) {
        url += `&sortBy=${filters.sortBy}`;
      }

      const response = await api.get<{ success: boolean; data: PaginatedResponse<Wish> }>(url);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener deseo por ID
  static async getWishById(wishId: string): Promise<Wish> {
    try {
      const response = await api.get<{ success: boolean; data: Wish }>(`/wishes/${wishId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Reservar deseo
  static async reserveWish(wishId: string): Promise<Wish> {
    try {
      const response = await api.post<{ success: boolean; data: Wish }>(`/wishes/${wishId}/reserve`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Cancelar reserva de un deseo
  static async cancelReservation(wishId: string): Promise<Wish> {
    try {
      const response = await api.delete<{ success: boolean; data: Wish }>(`/wishes/${wishId}/reserve`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }
}
