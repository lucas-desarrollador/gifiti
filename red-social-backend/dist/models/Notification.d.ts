import { Model, Optional } from 'sequelize';
import User from './User';
import Wish from './Wish';
interface NotificationAttributes {
    id: string;
    userId: string;
    type: 'wish_reserved' | 'wish_cancelled' | 'contact_request' | 'birthday_reminder';
    title: string;
    message: string;
    isRead: boolean;
    relatedUserId?: string;
    relatedWishId?: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'isRead' | 'metadata' | 'createdAt' | 'updatedAt'> {
}
declare class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
    id: string;
    userId: string;
    type: 'wish_reserved' | 'wish_cancelled' | 'contact_request' | 'birthday_reminder';
    title: string;
    message: string;
    isRead: boolean;
    relatedUserId?: string;
    relatedWishId?: string;
    metadata?: any;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    user?: User;
    relatedUser?: User;
    relatedWish?: Wish;
}
export default Notification;
//# sourceMappingURL=Notification.d.ts.map