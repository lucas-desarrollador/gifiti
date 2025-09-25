"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabase = exports.PrivacySettings = exports.BirthdayNotification = exports.Notification = exports.ReputationVote = exports.Contact = exports.Wish = exports.User = exports.sequelize = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Wish_1 = __importDefault(require("./Wish"));
exports.Wish = Wish_1.default;
const Contact_1 = __importDefault(require("./Contact"));
exports.Contact = Contact_1.default;
const ReputationVote_1 = require("./ReputationVote");
Object.defineProperty(exports, "ReputationVote", { enumerable: true, get: function () { return ReputationVote_1.ReputationVote; } });
const Notification_1 = __importDefault(require("./Notification"));
exports.Notification = Notification_1.default;
const BirthdayNotification_1 = __importDefault(require("./BirthdayNotification"));
exports.BirthdayNotification = BirthdayNotification_1.default;
const PrivacySettings_1 = require("./PrivacySettings");
Object.defineProperty(exports, "PrivacySettings", { enumerable: true, get: function () { return PrivacySettings_1.PrivacySettings; } });
// Definir todas las relaciones
User_1.default.hasMany(Wish_1.default, { foreignKey: 'userId', as: 'wishes' });
User_1.default.hasMany(Contact_1.default, { foreignKey: 'userId', as: 'contacts' });
User_1.default.hasMany(Contact_1.default, { foreignKey: 'contactId', as: 'contactRequests' });
// Relaciones para Contact
Contact_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
Contact_1.default.belongsTo(User_1.default, { foreignKey: 'contactId', as: 'contact' });
// Relaciones para Wish
Wish_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
Wish_1.default.belongsTo(User_1.default, { foreignKey: 'reservedBy', as: 'reservedByUser' });
// Relaciones para Notification
Notification_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
Notification_1.default.belongsTo(User_1.default, { foreignKey: 'relatedUserId', as: 'relatedUser' });
Notification_1.default.belongsTo(Wish_1.default, { foreignKey: 'relatedWishId', as: 'relatedWish' });
// Relaciones para votos de reputación
User_1.default.hasMany(ReputationVote_1.ReputationVote, { foreignKey: 'fromUserId', as: 'votesGiven' });
User_1.default.hasMany(ReputationVote_1.ReputationVote, { foreignKey: 'toUserId', as: 'votesReceived' });
// Relaciones para notificaciones
User_1.default.hasMany(Notification_1.default, { foreignKey: 'userId', as: 'notifications' });
User_1.default.hasMany(Notification_1.default, { foreignKey: 'relatedUserId', as: 'relatedNotifications' });
Wish_1.default.hasMany(Notification_1.default, { foreignKey: 'relatedWishId', as: 'notifications' });
// Relaciones para notificaciones de cumpleaños
User_1.default.hasMany(BirthdayNotification_1.default, { foreignKey: 'userId', as: 'birthdayNotifications' });
// Relaciones para configuraciones de privacidad
User_1.default.hasOne(PrivacySettings_1.PrivacySettings, { foreignKey: 'userId', as: 'privacySettings' });
PrivacySettings_1.PrivacySettings.belongsTo(User_1.default, { foreignKey: 'userId', as: 'privacyUser' });
// Sincronizar la base de datos
const syncDatabase = async () => {
    try {
        await database_1.default.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
        // Sincronizar modelos (crear tablas si no existen)
        await database_1.default.sync({ alter: true });
        console.log('✅ Modelos sincronizados correctamente.');
    }
    catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1);
    }
};
exports.syncDatabase = syncDatabase;
//# sourceMappingURL=index.js.map