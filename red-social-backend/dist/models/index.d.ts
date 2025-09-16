import sequelize from '../config/database';
import User from './User';
import Wish from './Wish';
import Contact from './Contact';
import { ReputationVote } from './ReputationVote';
import Notification from './Notification';
import BirthdayNotification from './BirthdayNotification';
import { PrivacySettings } from './PrivacySettings';
declare const syncDatabase: () => Promise<void>;
export { sequelize, User, Wish, Contact, ReputationVote, Notification, BirthdayNotification, PrivacySettings, syncDatabase, };
//# sourceMappingURL=index.d.ts.map