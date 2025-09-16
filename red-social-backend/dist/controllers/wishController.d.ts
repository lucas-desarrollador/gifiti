import { Request, Response } from 'express';
export declare const uploadWishImage: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getUserWishes: (req: Request, res: Response) => Promise<void>;
export declare const getUserWishesById: (req: Request, res: Response) => Promise<void>;
export declare const addWish: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateWish: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteWish: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const reorderWishes: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const exploreWishes: (req: Request, res: Response) => Promise<void>;
export declare const reserveWish: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelReservation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=wishController.d.ts.map