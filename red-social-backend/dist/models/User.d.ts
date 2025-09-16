import { Model, Optional } from 'sequelize';
interface UserAttributes {
    id: string;
    email: string;
    password: string;
    nickname: string;
    realName: string;
    birthDate: string;
    profileImage?: string;
    city?: string;
    province?: string;
    country?: string;
    postalAddress?: string;
    age?: number;
    createdAt: Date;
    updatedAt: Date;
    privacySettings?: any;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    email: string;
    password: string;
    nickname: string;
    realName: string;
    birthDate: string;
    profileImage?: string;
    city?: string;
    province?: string;
    country?: string;
    postalAddress?: string;
    age?: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    privacySettings?: any;
    validatePassword(password: string): Promise<boolean>;
    static hashPassword(password: string): Promise<string>;
}
export default User;
//# sourceMappingURL=User.d.ts.map