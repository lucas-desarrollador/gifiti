import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface ContactAttributes {
  id: string;
  userId: string;
  contactId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ContactCreationAttributes extends Optional<ContactAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
  public id!: string;
  public userId!: string;
  public contactId!: string;
  public status!: 'pending' | 'accepted' | 'rejected' | 'blocked';
  public deletedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Relaciones
  public user?: User;
  public contact?: User;
}

Contact.init(
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
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'blocked'),
      allowNull: false,
      defaultValue: 'pending',
    },
    deletedAt: {
      type: DataTypes.DATE,
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
    modelName: 'Contact',
    tableName: 'contacts',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'contactId'],
      },
    ],
  }
);

// Definir relaciones
Contact.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Contact.belongsTo(User, { foreignKey: 'contactId', as: 'contact' });

export default Contact;
