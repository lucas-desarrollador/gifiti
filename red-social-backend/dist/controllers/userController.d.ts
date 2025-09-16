import { Request, Response } from 'express';
export declare const uploadProfileImage: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const checkUserExists: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserCount: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map