// Tipos principales de la aplicación

export interface User {
  id: string;
  email: string;
  nickname: string;
  realName: string;
  birthDate: string;
  profileImage?: string;
  city?: string;
  province?: string;
  country?: string;
  postalAddress?: string;
  age?: number;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wish {
  id: string;
  userId: string;
  title: string;
  description: string;
  image?: string;
  purchaseLink?: string;
  position: number; // 1-10 para el top
  isReserved: boolean;
  reservedBy?: string;
  createdAt: string;
  updatedAt: string;
  user?: User; // Información del usuario que creó el deseo
}

export interface Contact {
  id: string;
  userId: string;
  contactId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  contact: User; // Información del contacto
}

export interface Notification {
  id: string;
  userId: string;
  type: 'wish_reserved' | 'wish_cancelled' | 'contact_request' | 'birthday_reminder';
  title: string;
  message: string;
  isRead: boolean;
  relatedUserId?: string;
  relatedWishId?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  relatedUser?: {
    id: string;
    nickname: string;
    realName: string;
    profileImage?: string;
  };
  relatedWish?: {
    id: string;
    title: string;
    image?: string;
  };
}

export interface Gift {
  id: string;
  giverId: string;
  receiverId: string;
  wishId: string;
  status: 'reserved' | 'gifted' | 'delivered';
  giftDate: string;
  vote?: number; // 1-5 estrellas
  voteComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  auth: AuthState;
  wishes: Wish[];
  contacts: Contact[];
  notifications: Notification[];
  gifts: Gift[];
}

// Tipos para formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  realName: string;
  birthDate: string;
}

export interface ProfileForm {
  nickname: string;
  realName: string;
  birthDate: string;
  city?: string;
  province?: string;
  country?: string;
  postalAddress?: string;
  age?: number;
  profileImage?: File;
}

export interface WishForm {
  title: string;
  description: string;
  image?: File;
  purchaseLink?: string;
}

// Tipos para API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  hasMore?: boolean;
}

// Tipos para navegación
export type NavigationTab = 'profile' | 'wishes' | 'contacts' | 'explore';

export interface ExploreFilters {
  type: 'users' | 'wishes';
  location?: string;
  tags?: string[];
  sortBy?: 'distance' | 'recent' | 'popular';
}
