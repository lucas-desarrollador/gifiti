import api, { handleApiResponse, handleApiError } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'wish_reserved' | 'wish_cancelled' | 'contact_request' | 'birthday_reminder' | 'contact_deleted' | 'wish_viewed' | 'wish_deleted_by_contact' | 'address_changed' | 'account_deleted' | 'wish_added' | 'wish_modified';
  title: string;
  message: string;
  isRead: boolean;
  relatedUserId?: string;
  relatedWishId?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  relatedUser?: {
    id: string;
    nickname: string;
    realName: string;
    profileImage?: string;
  };
  relatedWish?: {
    id: string;
    title: string;
    image?: string;
  };
}

export interface PaginatedNotifications {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class NotificationService {
  // Obtener notificaciones del usuario
  static async getNotifications(page: number = 1, limit: number = 20): Promise<PaginatedNotifications> {
    try {
      const response = await api.get<{ success: boolean; data: PaginatedNotifications }>(
        `/notifications?page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener contador de notificaciones no leídas
  static async getUnreadCount(): Promise<{ count: number }> {
    try {
      console.log('🔔 NotificationService - Obteniendo contador de notificaciones...');
      const response = await api.get<{ success: boolean; data: { count: number } }>('/notifications/count');
      const result = handleApiResponse(response);
      console.log('🔔 NotificationService - Contador obtenido:', result);
      console.log('🔔 NotificationService - Tipo de resultado:', typeof result);
      console.log('🔔 NotificationService - Resultado completo:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('🔔 NotificationService - Error al obtener contador:', error);
      throw new Error(handleApiError(error as any));
    }
  }

  // Marcar notificación como leída (VER)
  static async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await api.put<{ success: boolean; data: Notification }>(
        `/notifications/${notificationId}/read`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Marcar todas las notificaciones como leídas
  static async markAllAsRead(): Promise<void> {
    try {
      await api.put<{ success: boolean }>('/notifications/read-all');
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Eliminar notificación (IGNORAR)
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete<{ success: boolean }>(`/notifications/${notificationId}`);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener avisos del usuario
  static async getAvisos(page: number = 1, limit: number = 20): Promise<PaginatedNotifications> {
    try {
      const response = await api.get<{ success: boolean; data: PaginatedNotifications }>(
        `/notifications/avisos?page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

}

