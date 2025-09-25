import { Request, Response } from 'express';
export declare const getUserNotifications: (req: Request, res: Response) => Promise<void>;
export declare const markNotificationAsRead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUnreadNotificationCount: (req: Request, res: Response) => Promise<void>;
export declare const createWishReservedNotification: (wishOwnerId: string, reserverId: string, wishId: string, reserverName: string, wishTitle: string) => Promise<void>;
export declare const createWishCancelledNotification: (wishOwnerId: string, reserverId: string, wishId: string, reserverName: string, wishTitle: string) => Promise<void>;
export declare const cleanupExampleNotifications: (req: Request, res: Response) => Promise<void>;
export declare const getUserAvisos: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=notificationController.d.ts.map