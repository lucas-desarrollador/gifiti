"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaysUntilBirthday = exports.calculateAge = void 0;
/**
 * Calcula la edad basada en una fecha de nacimiento en formato ISO
 */
const calculateAge = (birthDate) => {
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
exports.calculateAge = calculateAge;
/**
 * Calcula los días hasta el próximo cumpleaños
 */
const getDaysUntilBirthday = (birthDate) => {
    const today = new Date();
    const [year, month, day] = birthDate.split('-').map(Number);
    const birthday = new Date(today.getFullYear(), month - 1, day);
    if (birthday < today) {
        birthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = birthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
exports.getDaysUntilBirthday = getDaysUntilBirthday;
//# sourceMappingURL=dateUtils.js.map