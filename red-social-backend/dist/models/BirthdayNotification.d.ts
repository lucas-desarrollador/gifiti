import { Model, Optional } from 'sequelize';
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
interface BirthdayNotificationCreationAttributes extends Optional<BirthdayNotificationAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class BirthdayNotification extends Model<BirthdayNotificationAttributes, BirthdayNotificationCreationAttributes> implements BirthdayNotificationAttributes {
    id: string;
    userId: string;
    contactId: string;
    contactName: string;
    contactNickname: string;
    contactProfileImage?: string;
    daysUntil: number;
    read: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default BirthdayNotification;
//# sourceMappingURL=BirthdayNotification.d.ts.map