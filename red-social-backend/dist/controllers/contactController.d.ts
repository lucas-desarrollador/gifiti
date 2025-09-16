import { Request, Response } from 'express';
export declare const getContacts: (req: Request, res: Response) => Promise<void>;
export declare const getContactsByBirthday: (req: Request, res: Response) => Promise<void>;
export declare const sendContactRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const acceptContactRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rejectContactRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeContact: (req: Request, res: Response) => Promise<void>;
export declare const getPendingRequests: (req: Request, res: Response) => Promise<void>;
export declare const getSentInvitations: (req: Request, res: Response) => Promise<void>;
export declare const searchUsersToAdd: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const blockAndRemoveContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBlockedContacts: (req: Request, res: Response) => Promise<void>;
export declare const unblockContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=contactController.d.ts.map