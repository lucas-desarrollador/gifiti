import { Request, Response } from 'express';
export declare const getUserReputation: (req: Request, res: Response) => Promise<void>;
export declare const addReputationVote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserVoteHistory: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=reputationController.d.ts.map