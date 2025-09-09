import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface WishAttributes {
  id: string;
  userId: string;
  title: string;
  description: string;
  image?: string;
  purchaseLink?: string;
  position: number;
  isReserved: boolean;
  reservedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WishCreationAttributes extends Optional<WishAttributes, 'id' | 'isReserved' | 'createdAt' | 'updatedAt'> {}

class Wish extends Model<WishAttributes, WishCreationAttributes> implements WishAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public description!: string;
  public image?: string;
  public purchaseLink?: string;
  public position!: number;
  public isReserved!: boolean;
  public reservedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Relaciones
  public user?: User;
}

Wish.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 500],
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchaseLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    isReserved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reservedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
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
    modelName: 'Wish',
    tableName: 'wishes',
    timestamps: true,
  }
);

// Definir relaciones
Wish.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wish.belongsTo(User, { foreignKey: 'reservedBy', as: 'reservedByUser' });

export default Wish;
