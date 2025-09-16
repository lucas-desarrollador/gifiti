import sequelize from '../config/database';
import User from './User';
import Wish from './Wish';
import Contact from './Contact';
import { ReputationVote } from './ReputationVote';
import Notification from './Notification';
import BirthdayNotification from './BirthdayNotification';
import { PrivacySettings } from './PrivacySettings';

// Definir todas las relaciones
User.hasMany(Wish, { foreignKey: 'userId', as: 'wishes' });
User.hasMany(Contact, { foreignKey: 'userId', as: 'contacts' });
User.hasMany(Contact, { foreignKey: 'contactId', as: 'contactRequests' });

// Relaciones para Contact
Contact.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Contact.belongsTo(User, { foreignKey: 'contactId', as: 'contact' });

// Relaciones para Wish
Wish.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wish.belongsTo(User, { foreignKey: 'reservedBy', as: 'reservedByUser' });

// Relaciones para Notification
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(User, { foreignKey: 'relatedUserId', as: 'relatedUser' });
Notification.belongsTo(Wish, { foreignKey: 'relatedWishId', as: 'relatedWish' });

// Relaciones para votos de reputación
User.hasMany(ReputationVote, { foreignKey: 'fromUserId', as: 'votesGiven' });
User.hasMany(ReputationVote, { foreignKey: 'toUserId', as: 'votesReceived' });

// Relaciones para notificaciones
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Notification, { foreignKey: 'relatedUserId', as: 'relatedNotifications' });
Wish.hasMany(Notification, { foreignKey: 'relatedWishId', as: 'notifications' });

// Relaciones para notificaciones de cumpleaños
User.hasMany(BirthdayNotification, { foreignKey: 'userId', as: 'birthdayNotifications' });

// Relaciones para configuraciones de privacidad
User.hasOne(PrivacySettings, { foreignKey: 'userId', as: 'privacySettings' });
PrivacySettings.belongsTo(User, { foreignKey: 'userId', as: 'privacyUser' });

// Sincronizar la base de datos
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

export {
  sequelize,
  User,
  Wish,
  Contact,
  ReputationVote,
  Notification,
  BirthdayNotification,
  PrivacySettings,
  syncDatabase,
};
