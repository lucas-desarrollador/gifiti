import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Wish, Contact, Notification, Gift, AppState } from '../types';

// Tipos para el contexto
interface AppContextType {
  state: AppState;
  setWishes: (wishes: Wish[]) => void;
  addWish: (wish: Wish) => void;
  updateWish: (wish: Wish) => void;
  removeWish: (wishId: string) => void;
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (contact: Contact) => void;
  removeContact: (contactId: string) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  setGifts: (gifts: Gift[]) => void;
  addGift: (gift: Gift) => void;
  updateGift: (gift: Gift) => void;
}

// Acciones del reducer
type AppAction =
  | { type: 'SET_WISHES'; payload: Wish[] }
  | { type: 'ADD_WISH'; payload: Wish }
  | { type: 'UPDATE_WISH'; payload: Wish }
  | { type: 'REMOVE_WISH'; payload: string }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'REMOVE_CONTACT'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_GIFTS'; payload: Gift[] }
  | { type: 'ADD_GIFT'; payload: Gift }
  | { type: 'UPDATE_GIFT'; payload: Gift };

// Estado inicial
const initialState: AppState = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  },
  wishes: [],
  contacts: [],
  notifications: [],
  gifts: [],
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_WISHES':
      return {
        ...state,
        wishes: action.payload,
      };
    case 'ADD_WISH':
      return {
        ...state,
        wishes: [...state.wishes, action.payload],
      };
    case 'UPDATE_WISH':
      return {
        ...state,
        wishes: state.wishes.map(wish =>
          wish.id === action.payload.id ? action.payload : wish
        ),
      };
    case 'REMOVE_WISH':
      return {
        ...state,
        wishes: state.wishes.filter(wish => wish.id !== action.payload),
      };
    case 'SET_CONTACTS':
      return {
        ...state,
        contacts: action.payload,
      };
    case 'ADD_CONTACT':
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
      };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
      };
    case 'REMOVE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload),
      };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
      };
    case 'SET_GIFTS':
      return {
        ...state,
        gifts: action.payload,
      };
    case 'ADD_GIFT':
      return {
        ...state,
        gifts: [...state.gifts, action.payload],
      };
    case 'UPDATE_GIFT':
      return {
        ...state,
        gifts: state.gifts.map(gift =>
          gift.id === action.payload.id ? action.payload : gift
        ),
      };
    default:
      return state;
  }
};

// Crear contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Funciones para wishes
  const setWishes = (wishes: Wish[]) => {
    dispatch({ type: 'SET_WISHES', payload: wishes });
  };

  const addWish = (wish: Wish) => {
    dispatch({ type: 'ADD_WISH', payload: wish });
  };

  const updateWish = (wish: Wish) => {
    dispatch({ type: 'UPDATE_WISH', payload: wish });
  };

  const removeWish = (wishId: string) => {
    dispatch({ type: 'REMOVE_WISH', payload: wishId });
  };

  // Funciones para contacts
  const setContacts = (contacts: Contact[]) => {
    dispatch({ type: 'SET_CONTACTS', payload: contacts });
  };

  const addContact = (contact: Contact) => {
    dispatch({ type: 'ADD_CONTACT', payload: contact });
  };

  const updateContact = (contact: Contact) => {
    dispatch({ type: 'UPDATE_CONTACT', payload: contact });
  };

  const removeContact = (contactId: string) => {
    dispatch({ type: 'REMOVE_CONTACT', payload: contactId });
  };


  // Funciones para notifications
  const setNotifications = (notifications: Notification[]) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  };

  const addNotification = (notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  // Funciones para gifts
  const setGifts = (gifts: Gift[]) => {
    dispatch({ type: 'SET_GIFTS', payload: gifts });
  };

  const addGift = (gift: Gift) => {
    dispatch({ type: 'ADD_GIFT', payload: gift });
  };

  const updateGift = (gift: Gift) => {
    dispatch({ type: 'UPDATE_GIFT', payload: gift });
  };

  const value: AppContextType = {
    state,
    setWishes,
    addWish,
    updateWish,
    removeWish,
    setContacts,
    addContact,
    updateContact,
    removeContact,
    setNotifications,
    addNotification,
    markNotificationAsRead,
    setGifts,
    addGift,
    updateGift,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};
