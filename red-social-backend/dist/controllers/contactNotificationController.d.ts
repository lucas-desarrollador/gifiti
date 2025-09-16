import { Request, Response } from 'express';
export declare const sendContactInvitation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPendingInvitations: (req: Request, res: Response) => Promise<void>;
export declare const respondToInvitation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPendingInvitationsCount: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=contactNotificationController.d.ts.map