import { Model, Optional } from 'sequelize';
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
interface WishCreationAttributes extends Optional<WishAttributes, 'id' | 'isReserved' | 'createdAt' | 'updatedAt'> {
}
declare class Wish extends Model<WishAttributes, WishCreationAttributes> implements WishAttributes {
    id: string;
    userId: string;
    title: string;
    description: string;
    image?: string;
    purchaseLink?: string;
    position: number;
    isReserved: boolean;
    reservedBy?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    user?: User;
}
export default Wish;
//# sourceMappingURL=Wish.d.ts.map