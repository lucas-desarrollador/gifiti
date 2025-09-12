// Utilidades para manejo de imágenes

const API_BASE_URL = 'http://localhost:3001';

/**
 * Construye la URL completa para una imagen de perfil
 * @param profileImage - Nombre del archivo de imagen de perfil
 * @returns URL completa o undefined si no hay imagen
 */
export const getProfileImageUrl = (profileImage?: string): string | undefined => {
  if (!profileImage) return undefined;
  return `${API_BASE_URL}/uploads/profiles/${profileImage}`;
};

/**
 * Construye la URL completa para una imagen de deseo
 * @param wishImage - Nombre del archivo de imagen de deseo
 * @returns URL completa o undefined si no hay imagen
 */
export const getWishImageUrl = (wishImage?: string): string | undefined => {
  if (!wishImage) return undefined;
  return `${API_BASE_URL}/uploads/wishes/${wishImage}`;
};

/**
 * Construye la URL completa para cualquier imagen en uploads
 * @param folder - Carpeta dentro de uploads (profiles, wishes, etc.)
 * @param filename - Nombre del archivo
 * @returns URL completa o undefined si no hay archivo
 */
export const getUploadImageUrl = (folder: string, filename?: string): string | undefined => {
  if (!filename) return undefined;
  return `${API_BASE_URL}/uploads/${folder}/${filename}`;
};
