import { Model, Optional } from 'sequelize';
interface ReputationVoteAttributes {
    id: number;
    fromUserId: string;
    toUserId: string;
    type: 'positive' | 'negative';
    promiseId?: string;
    createdAt: Date;
    updatedAt: Date;
}
interface ReputationVoteCreationAttributes extends Optional<ReputationVoteAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class ReputationVote extends Model<ReputationVoteAttributes, ReputationVoteCreationAttributes> implements ReputationVoteAttributes {
    id: number;
    fromUserId: string;
    toUserId: string;
    type: 'positive' | 'negative';
    promiseId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export { ReputationVote };
//# sourceMappingURL=ReputationVote.d.ts.map