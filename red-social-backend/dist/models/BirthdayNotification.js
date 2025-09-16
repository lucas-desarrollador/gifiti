"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class BirthdayNotification extends sequelize_1.Model {
}
BirthdayNotification.init({
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
    contactId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    contactName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactNickname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactProfileImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    daysUntil: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    read: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
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
    modelName: 'BirthdayNotification',
    tableName: 'BirthdayNotifications',
    timestamps: true,
});
exports.default = BirthdayNotification;
//# sourceMappingURL=BirthdayNotification.js.map