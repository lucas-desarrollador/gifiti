export declare class ContactManagementService {
    /**
     * Elimina un contacto y maneja todas las operaciones en cascada
     */
    static deleteContact(userId: string, contactId: string): Promise<void>;
    /**
     * Cancela todas las reservas de deseos entre dos usuarios
     */
    static cancelWishReservationsBetweenUsers(user1Id: string, user2Id: string, transaction: any): Promise<void>;
    /**
     * Maneja la eliminación de cuenta de usuario y limpia todas las acciones pendientes
     */
    static handleAccountDeletion(userId: string): Promise<void>;
    /**
     * Cancela todas las reservas de deseos de un usuario
     */
    static cancelAllUserWishReservations(userId: string, transaction: any): Promise<void>;
}
//# sourceMappingURL=contactManagementService.d.ts.map