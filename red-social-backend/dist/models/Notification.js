"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Wish_1 = __importDefault(require("./Wish"));
class Notification extends sequelize_1.Model {
}
Notification.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('wish_reserved', 'wish_cancelled', 'contact_request', 'birthday_reminder'),
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    relatedUserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    relatedWishId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'wishes',
            key: 'id',
        },
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
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
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
});
// Definir relaciones
Notification.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(User_1.default, { foreignKey: 'relatedUserId', as: 'relatedUser' });
Notification.belongsTo(Wish_1.default, { foreignKey: 'relatedWishId', as: 'relatedWish' });
exports.default = Notification;
//# sourceMappingURL=Notification.js.map