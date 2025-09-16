import { Contact, User, Wish, Notification } from '../models';
import { Op } from 'sequelize';

export class ContactManagementService {
  /**
   * Elimina un contacto y maneja todas las operaciones en cascada
   */
  static async deleteContact(userId: string, contactId: string): Promise<void> {
    const transaction = await Contact.sequelize!.transaction();
    
    try {
      console.log(`[ContactManagementService] Iniciando eliminación de contacto: ${userId} -> ${contactId}`);
      
      // 1. Buscar la relación de contacto
      const contact = await Contact.findOne({
        where: { 
          id: contactId,
          [Op.or]: [
            { userId: userId },
            { contactId: userId }
          ]
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nickname', 'realName']
          },
          {
            model: User,
            as: 'contact',
            attributes: ['id', 'nickname', 'realName']
          }
        ],
        transaction
      });

      if (!contact) {
        throw new Error('Contacto no encontrado');
      }

      // 2. Determinar quién será notificado
      const userToNotify = contact.userId === userId ? contact.contact : contact.user;
      const deletingUser = contact.userId === userId ? contact.user : contact.contact;

      if (!userToNotify || !deletingUser) {
        throw new Error('No se pudo determinar los usuarios involucrados');
      }

      console.log(`[ContactManagementService] Usuario que elimina: ${deletingUser.nickname} (${deletingUser.id})`);
      console.log(`[ContactManagementService] Usuario a notificar: ${userToNotify.nickname} (${userToNotify.id})`);

      // 3. Cancelar todas las reservas de deseos entre estos usuarios
      await this.cancelWishReservationsBetweenUsers(userId, userToNotify.id, transaction);

      // 4. Crear notificación de eliminación de contacto
      await Notification.create({
        userId: userToNotify.id,
        type: 'contact_deleted',
        title: 'Contacto eliminado',
        message: `${deletingUser.realName || deletingUser.nickname} te eliminó de sus contactos`,
        relatedUserId: deletingUser.id,
        metadata: {
          deletingUserName: deletingUser.realName || deletingUser.nickname,
          deletingUserNickname: deletingUser.nickname,
        },
      }, { transaction });

      // 5. Eliminar el contacto principal
      await contact.destroy({ transaction });

      // 6. Eliminar el contacto recíproco si existe
      const reciprocalContact = await Contact.findOne({
        where: {
          userId: userToNotify.id,
          contactId: deletingUser.id
        },
        transaction
      });

      if (reciprocalContact) {
        await reciprocalContact.destroy({ transaction });
        console.log(`[ContactManagementService] Contacto recíproco eliminado`);
      }

      await transaction.commit();
      console.log(`[ContactManagementService] Eliminación de contacto completada exitosamente`);
      
    } catch (error) {
      await transaction.rollback();
      console.error(`[ContactManagementService] Error al eliminar contacto:`, error);
      throw error;
    }
  }

  /**
   * Cancela todas las reservas de deseos entre dos usuarios
   */
  static async cancelWishReservationsBetweenUsers(user1Id: string, user2Id: string, transaction: any): Promise<void> {
    console.log(`[ContactManagementService] Cancelando reservas entre usuarios: ${user1Id} y ${user2Id}`);
    
    // Buscar todos los deseos reservados entre estos usuarios
    const reservedWishes = await Wish.findAll({
      where: {
        [Op.or]: [
          { userId: user1Id, reservedBy: user2Id, isReserved: true },
          { userId: user2Id, reservedBy: user1Id, isReserved: true }
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'realName']
        }
      ],
      transaction
    });

    console.log(`[ContactManagementService] Encontrados ${reservedWishes.length} deseos reservados para cancelar`);

    for (const wish of reservedWishes) {
      // Obtener información del usuario que reservó
      const reserver = await User.findByPk(wish.reservedBy!, {
        attributes: ['id', 'nickname', 'realName'],
        transaction
      });

      // Cancelar la reserva
      await wish.update({ 
        isReserved: false,
        reservedBy: undefined
      }, { transaction });

      // Crear notificación de cancelación de reserva
      if (reserver) {
        await Notification.create({
          userId: wish.userId,
          type: 'wish_cancelled',
          title: 'Reserva cancelada',
          message: `Tu reserva del deseo "${wish.title}" fue cancelada porque ${reserver.realName || reserver.nickname} te eliminó de sus contactos`,
          relatedUserId: reserver.id,
          relatedWishId: wish.id,
          metadata: {
            cancellationReason: 'contact_deleted',
            reserverName: reserver.realName || reserver.nickname,
            wishTitle: wish.title
          },
        }, { transaction });

        console.log(`[ContactManagementService] Notificación de cancelación creada para ${wish.user?.nickname}`);
      }
    }
  }

  /**
   * Maneja la eliminación de cuenta de usuario y limpia todas las acciones pendientes
   */
  static async handleAccountDeletion(userId: string): Promise<void> {
    const transaction = await User.sequelize!.transaction();
    
    try {
      console.log(`[ContactManagementService] Iniciando eliminación de cuenta: ${userId}`);
      
      // 1. Obtener información del usuario
      const user = await User.findByPk(userId, {
        attributes: ['id', 'nickname', 'realName'],
        transaction
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // 2. Obtener todos los contactos del usuario
      const contacts = await Contact.findAll({
        where: {
          [Op.or]: [
            { userId: userId },
            { contactId: userId }
          ]
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nickname', 'realName']
          },
          {
            model: User,
            as: 'contact',
            attributes: ['id', 'nickname', 'realName']
          }
        ],
        transaction
      });

      // 3. Notificar a todos los contactos sobre la eliminación de cuenta
      for (const contact of contacts) {
        const contactToNotify = contact.userId === userId ? contact.contact : contact.user;
        
        if (contactToNotify) {
          await Notification.create({
            userId: contactToNotify.id,
            type: 'account_deleted',
            title: 'Contacto eliminado',
            message: `${user.realName || user.nickname} eliminó su cuenta`,
            relatedUserId: userId,
            metadata: {
              deletedUserName: user.realName || user.nickname,
              deletedUserNickname: user.nickname,
            },
          }, { transaction });
        }
      }

      // 4. Cancelar todas las reservas de deseos del usuario
      await this.cancelAllUserWishReservations(userId, transaction);

      // 5. Eliminar todas las relaciones de contacto
      await Contact.destroy({
        where: {
          [Op.or]: [
            { userId: userId },
            { contactId: userId }
          ]
        },
        transaction
      });

      // 6. Eliminar todas las notificaciones del usuario
      await Notification.destroy({
        where: { userId: userId },
        transaction
      });

      // 7. Eliminar el usuario físicamente
      await user.destroy({ transaction });

      await transaction.commit();
      console.log(`[ContactManagementService] Eliminación de cuenta completada exitosamente`);
      
    } catch (error) {
      await transaction.rollback();
      console.error(`[ContactManagementService] Error al eliminar cuenta:`, error);
      throw error;
    }
  }

  /**
   * Cancela todas las reservas de deseos de un usuario
   */
  static async cancelAllUserWishReservations(userId: string, transaction: any): Promise<void> {
    console.log(`[ContactManagementService] Cancelando todas las reservas del usuario: ${userId}`);
    
    // Buscar deseos donde el usuario es propietario y están reservados por otros
    const ownedWishes = await Wish.findAll({
      where: {
        userId: userId,
        isReserved: true
      },
      transaction
    });

    // Buscar deseos que el usuario ha reservado
    const reservedWishes = await Wish.findAll({
      where: {
        reservedBy: userId,
        isReserved: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'realName']
        }
      ],
      transaction
    });

    // Cancelar reservas de deseos propios
    for (const wish of ownedWishes) {
      const reserver = await User.findByPk(wish.reservedBy!, {
        attributes: ['id', 'nickname', 'realName'],
        transaction
      });

      await wish.update({ 
        isReserved: false,
        reservedBy: undefined
      }, { transaction });

      if (reserver) {
        await Notification.create({
          userId: reserver.id,
          type: 'wish_cancelled',
          title: 'Reserva cancelada',
          message: `Tu reserva del deseo "${wish.title}" fue cancelada porque ${wish.user?.realName || wish.user?.nickname} eliminó su cuenta`,
          relatedUserId: userId,
          relatedWishId: wish.id,
          metadata: {
            cancellationReason: 'account_deleted',
            wishOwnerName: wish.user?.realName || wish.user?.nickname,
            wishTitle: wish.title
          },
        }, { transaction });
      }
    }

    // Cancelar reservas de deseos de otros
    for (const wish of reservedWishes) {
      await wish.update({ 
        isReserved: false,
        reservedBy: undefined
      }, { transaction });

      await Notification.create({
        userId: wish.userId,
        type: 'wish_cancelled',
        title: 'Reserva cancelada',
        message: `Tu reserva del deseo "${wish.title}" fue cancelada porque ${wish.user?.realName || wish.user?.nickname} eliminó su cuenta`,
        relatedUserId: userId,
        relatedWishId: wish.id,
        metadata: {
          cancellationReason: 'account_deleted',
          reserverName: wish.user?.realName || wish.user?.nickname,
          wishTitle: wish.title
        },
      }, { transaction });
    }
  }
}
