import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PrivacySettingsAttributes {
  id: number;
  userId: string;
  showAge: boolean;
  showEmail: boolean;
  showAllWishes: boolean;
  showContactsList: boolean;
  showMutualFriends: boolean;
  showLocation: boolean;
  showPostalAddress: boolean;
  isPublicProfile: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrivacySettingsCreationAttributes extends Optional<PrivacySettingsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class PrivacySettings extends Model<PrivacySettingsAttributes, PrivacySettingsCreationAttributes> implements PrivacySettingsAttributes {
  public id!: number;
  public userId!: string;
  public showAge!: boolean;
  public showEmail!: boolean;
  public showAllWishes!: boolean;
  public showContactsList!: boolean;
  public showMutualFriends!: boolean;
  public showLocation!: boolean;
  public showPostalAddress!: boolean;
  public isPublicProfile!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PrivacySettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      unique: true, // Un usuario solo puede tener una configuración de privacidad
    },
    showAge: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    showEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    showAllWishes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    showContactsList: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    showMutualFriends: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    showLocation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    showPostalAddress: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isPublicProfile: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'PrivacySettings',
    tableName: 'privacy_settings',
    timestamps: true,
  }
);
