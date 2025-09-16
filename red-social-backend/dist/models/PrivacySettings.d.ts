import { Model, Optional } from 'sequelize';
export interface PrivacySettingsAttributes {
    id: number;
    userId: string;
    showAge: boolean;
    showEmail: boolean;
    showAllWishes: boolean;
    showContactsList: boolean;
    showMutualFriends: boolean;
    showLocation: boolean;
    showPostalAddress: boolean;
    isPublicProfile: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface PrivacySettingsCreationAttributes extends Optional<PrivacySettingsAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class PrivacySettings extends Model<PrivacySettingsAttributes, PrivacySettingsCreationAttributes> implements PrivacySettingsAttributes {
    id: number;
    userId: string;
    showAge: boolean;
    showEmail: boolean;
    showAllWishes: boolean;
    showContactsList: boolean;
    showMutualFriends: boolean;
    showLocation: boolean;
    showPostalAddress: boolean;
    isPublicProfile: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=PrivacySettings.d.ts.map