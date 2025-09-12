import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReputationVoteAttributes {
  id: number;
  fromUserId: string; // Usuario que da el voto (UUID)
  toUserId: string;   // Usuario que recibe el voto (UUID)
  type: 'positive' | 'negative'; // Tipo de voto
  promiseId?: string; // ID de la promesa relacionada (opcional, UUID)
  createdAt: Date;
  updatedAt: Date;
}

interface ReputationVoteCreationAttributes extends Optional<ReputationVoteAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ReputationVote extends Model<ReputationVoteAttributes, ReputationVoteCreationAttributes> implements ReputationVoteAttributes {
  public id!: number;
  public fromUserId!: string;
  public toUserId!: string;
  public type!: 'positive' | 'negative';
  public promiseId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ReputationVote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fromUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    toUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('positive', 'negative'),
      allowNull: false,
    },
    promiseId: {
      type: DataTypes.UUID,
      allowNull: true,
      // TODO: Agregar referencia a la tabla de promesas cuando se implemente
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
    modelName: 'ReputationVote',
    tableName: 'ReputationVotes',
    timestamps: true,
  }
);

export { ReputationVote };
