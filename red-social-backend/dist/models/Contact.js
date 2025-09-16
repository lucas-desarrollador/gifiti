"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Contact extends sequelize_1.Model {
}
Contact.init({
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
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'accepted', 'rejected', 'blocked'),
        allowNull: false,
        defaultValue: 'pending',
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
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
    modelName: 'Contact',
    tableName: 'contacts',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'contactId'],
        },
    ],
});
// Definir relaciones
Contact.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
Contact.belongsTo(User_1.default, { foreignKey: 'contactId', as: 'contact' });
exports.default = Contact;
//# sourceMappingURL=Contact.js.map