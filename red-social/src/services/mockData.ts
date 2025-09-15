// Datos mock para probar la UI sin backend
import { User, Wish, Contact } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'lucasgongora.dev@gmail.com',
  nickname: 'lucas',
  realName: 'lucas góngora',
  birthDate: '1985-03-28',
  profileImage: '',
  address: '',
  age: 39,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
//comentario
export const mockWishes: Wish[] = [
  {
    id: '1',
    userId: '1',
    title: 'iPhone 15 Pro',
    description: 'El último iPhone con todas las características avanzadas. Me encantaría tenerlo para mi trabajo y fotografía.',
    image: '',
    purchaseLink: 'https://apple.com/iphone-15-pro',
    position: 1,
    isReserved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    title: 'AirPods Pro',
    description: 'Auriculares inalámbricos con cancelación de ruido. Perfectos para escuchar música y hacer llamadas.',
    image: '',
    purchaseLink: 'https://apple.com/airpods-pro',
    position: 2,
    isReserved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    userId: '1',
    contactId: '2',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    contact: {
      id: '2',
      email: 'maria@ejemplo.com',
      nickname: 'maria',
      realName: 'María García',
      birthDate: '1990-05-15',
      profileImage: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];
