"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationVote = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ReputationVote extends sequelize_1.Model {
}
exports.ReputationVote = ReputationVote;
ReputationVote.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fromUserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    toUserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('positive', 'negative'),
        allowNull: false,
    },
    promiseId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        // TODO: Agregar referencia a la tabla de promesas cuando se implemente
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'ReputationVote',
    tableName: 'ReputationVotes',
    timestamps: true,
});
//# sourceMappingURL=ReputationVote.js.map