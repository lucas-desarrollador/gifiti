import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Wish from './Wish';

interface NotificationAttributes {
  id: string;
  userId: string; // Usuario que recibe la notificación
  type: 'wish_reserved' | 'wish_cancelled' | 'contact_request' | 'birthday_reminder';
  title: string;
  message: string;
  isRead: boolean;
  relatedUserId?: string; // Usuario que causó la notificación
  relatedWishId?: string; // Deseo relacionado
  metadata?: any; // Datos adicionales
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'isRead' | 'metadata' | 'createdAt' | 'updatedAt'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public userId!: string;
  public type!: 'wish_reserved' | 'wish_cancelled' | 'contact_request' | 'birthday_reminder';
  public title!: string;
  public message!: string;
  public isRead!: boolean;
  public relatedUserId?: string;
  public relatedWishId?: string;
  public metadata?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Relaciones
  public user?: User;
  public relatedUser?: User;
  public relatedWish?: Wish;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('wish_reserved', 'wish_cancelled', 'contact_request', 'birthday_reminder'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    relatedUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    relatedWishId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'wishes',
        key: 'id',
      },
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
  }
);

// Definir relaciones
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(User, { foreignKey: 'relatedUserId', as: 'relatedUser' });
Notification.belongsTo(Wish, { foreignKey: 'relatedWishId', as: 'relatedWish' });

export default Notification;
