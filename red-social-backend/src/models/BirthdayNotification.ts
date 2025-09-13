import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BirthdayNotificationAttributes {
  id: string;
  userId: string;
  contactId: string;
  contactName: string;
  contactNickname: string;
  contactProfileImage?: string;
  daysUntil: number;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BirthdayNotificationCreationAttributes extends Optional<BirthdayNotificationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class BirthdayNotification extends Model<BirthdayNotificationAttributes, BirthdayNotificationCreationAttributes> implements BirthdayNotificationAttributes {
  public id!: string;
  public userId!: string;
  public contactId!: string;
  public contactName!: string;
  public contactNickname!: string;
  public contactProfileImage?: string;
  public daysUntil!: number;
  public read!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BirthdayNotification.init(
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
    contactId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactProfileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    daysUntil: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'BirthdayNotification',
    tableName: 'BirthdayNotifications',
    timestamps: true,
  }
);

export default BirthdayNotification;
