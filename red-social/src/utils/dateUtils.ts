/**
 * Formatea una fecha en formato ISO (YYYY-MM-DD) a una fecha legible en español
 * sin problemas de zona horaria
 */
export const formatDateToSpanish = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Calcula la edad basada en una fecha de nacimiento en formato ISO
 */
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const [year, month, day] = birthDate.split('-').map(Number);
  const birth = new Date(year, month - 1, day);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Calcula los días hasta el próximo cumpleaños
 */
export const getDaysUntilBirthday = (birthDate: string): number => {
  const today = new Date();
  const [year, month, day] = birthDate.split('-').map(Number);
  const birthday = new Date(today.getFullYear(), month - 1, day);
  
  if (birthday < today) {
    birthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = birthday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

