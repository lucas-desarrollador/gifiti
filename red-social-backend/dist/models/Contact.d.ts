import { Model, Optional } from 'sequelize';
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
interface ContactCreationAttributes extends Optional<ContactAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
}
declare class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
    id: string;
    userId: string;
    contactId: string;
    status: 'pending' | 'accepted' | 'rejected' | 'blocked';
    deletedAt?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    user?: User;
    contact?: User;
}
export default Contact;
//# sourceMappingURL=Contact.d.ts.map