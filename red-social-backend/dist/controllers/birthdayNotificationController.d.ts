import { Request, Response } from 'express';
export declare const getBirthdayNotifications: (req: Request, res: Response) => Promise<void>;
export declare const markBirthdayNotificationAsRead: (req: Request, res: Response) => Promise<void>;
export declare const markAllBirthdayNotificationsAsRead: (req: Request, res: Response) => Promise<void>;
export declare const markBirthdayNotificationAsUnread: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=birthdayNotificationController.d.ts.map