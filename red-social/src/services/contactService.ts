import api, { handleApiResponse, handleApiError } from './api';
import { Contact, PaginatedResponse } from '../types';

export class ContactService {
  // Obtener contactos del usuario actual
  static async getContacts(): Promise<Contact[]> {
    try {
      const response = await api.get<{ success: boolean; data: Contact[] }>('/contacts');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener contactos con paginación
  static async getContactsPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Contact>> {
    try {
      const response = await api.get<{ success: boolean; data: PaginatedResponse<Contact> }>(
        `/contacts?page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener contactos ordenados por cumpleaños
  static async getContactsByBirthday(): Promise<Contact[]> {
    try {
      const response = await api.get<{ success: boolean; data: Contact[] }>('/contacts/birthday-order');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Enviar solicitud de contacto
  static async sendContactRequest(userId: string): Promise<Contact> {
    try {
      const response = await api.post<{ success: boolean; data: Contact }>(
        '/contacts/request',
        { userId }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Aceptar solicitud de contacto
  static async acceptContactRequest(contactId: string): Promise<Contact> {
    try {
      const response = await api.put<{ success: boolean; data: Contact }>(
        `/contacts/${contactId}/accept`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Rechazar solicitud de contacto
  static async rejectContactRequest(contactId: string): Promise<void> {
    try {
      await api.put(`/contacts/${contactId}/reject`);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Eliminar contacto
  static async removeContact(contactId: string): Promise<void> {
    try {
      await api.delete(`/contacts/${contactId}`);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Bloquear y eliminar contacto
  static async blockAndRemoveContact(contactId: string): Promise<void> {
    try {
      await api.delete(`/contacts/${contactId}/block`);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener contactos bloqueados
  static async getBlockedContacts(): Promise<Contact[]> {
    try {
      const response = await api.get<{ success: boolean; data: Contact[] }>('/contacts/blocked');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Desbloquear contacto
  static async unblockContact(contactId: string): Promise<void> {
    try {
      await api.put(`/contacts/${contactId}/unblock`);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener solicitudes pendientes
  static async getPendingRequests(): Promise<Contact[]> {
    try {
      const response = await api.get<{ success: boolean; data: Contact[] }>('/contacts/pending');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener invitaciones enviadas (pendientes de respuesta)
  static async getSentInvitations(): Promise<Contact[]> {
    try {
      const response = await api.get<{ success: boolean; data: Contact[] }>('/contacts/sent-invitations');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener invitaciones pendientes (alias para getPendingRequests)
  static async getPendingInvitations(): Promise<{ invitations: Contact[] }> {
    try {
      const invitations = await this.getPendingRequests();
      return { invitations };
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Aceptar invitación
  static async acceptInvitation(contactId: string): Promise<{ contact: Contact }> {
    try {
      const response = await api.put<{ success: boolean; data: Contact }>(`/contacts/${contactId}/accept`);
      return { contact: handleApiResponse(response) };
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Rechazar invitación
  static async rejectInvitation(contactId: string): Promise<void> {
    try {
      await this.rejectContactRequest(contactId);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Buscar usuarios para agregar como contacto
  static async searchUsersToAdd(query: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<any>> {
    try {
      const response = await api.get<{ success: boolean; data: PaginatedResponse<any> }>(
        `/contacts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Verificar si ya existe una relación de contacto
  static async checkContactStatus(userId: string): Promise<{ status: 'none' | 'pending' | 'accepted' | 'rejected'; contactId?: string }> {
    try {
      const response = await api.get<{ success: boolean; data: { status: string; contactId?: string } }>(
        `/contacts/status/${userId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }

  // Obtener contactos que cumplen años en un rango de fechas
  static async getContactsByBirthdayRange(startDate: string, endDate: string): Promise<Contact[]> {
    try {
      const response = await api.get<{ success: boolean; data: Contact[] }>(
        `/contacts/birthday-range?start=${startDate}&end=${endDate}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error as any));
    }
  }
}
