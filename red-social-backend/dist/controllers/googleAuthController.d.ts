import { Request, Response } from 'express';
export declare const exchangeCodeForToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkUserExists: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=googleAuthController.d.ts.map