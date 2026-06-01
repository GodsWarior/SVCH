import { Language, translations } from './i18n';

export type ValidationErrors = Record<string, string>;

const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]{2,60}$/;
const phoneRegex = /^\+?\d{10,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const safeTextRegex = /^[A-Za-zА-Яа-яЁё0-9\s.,'"№/-]{1,120}$/;
const weightRegex = /^[A-Za-zА-Яа-яЁё0-9\s.,/-]{1,40}$/;

const isPositiveNumber = (value: string) => Number.isFinite(Number(value)) && Number(value) > 0;
const isNonNegativeInteger = (value: string) => /^\d+$/.test(value) && Number(value) >= 0;

const messages = (language: Language) => translations[language];

export const validateAuth = (
  form: { name: string; email: string; phone: string; password: string },
  mode: 'login' | 'register',
  language: Language = 'ru',
) => {
  const m = messages(language);
  const errors: ValidationErrors = {};
  const email = form.email.trim();

  if (!emailRegex.test(email)) {
    errors.email = m.validationEmail;
  }
  if (form.password.length < (mode === 'register' ? 8 : 1)) {
    errors.password = mode === 'register' ? m.validationPasswordMin : m.validationPasswordRequired;
  }
  if (mode === 'register') {
    if (!nameRegex.test(form.name.trim())) {
      errors.name = m.validationName;
    }
    if (form.phone && !phoneRegex.test(form.phone.trim())) {
      errors.phone = m.validationPhone;
    }
  }

  return errors;
};

export const validateAddress = (
  form: {
    city: string;
    street: string;
    house: string;
    flat: string;
    deliverAtTime: boolean;
    deliveryDate: string;
    deliveryStartTime: string;
  },
  language: Language = 'ru',
) => {
  const m = messages(language);
  const errors: ValidationErrors = {};
  if (!safeTextRegex.test(form.city.trim())) errors.city = m.validationCity;
  if (!safeTextRegex.test(form.street.trim())) errors.street = m.validationStreet;
  if (!safeTextRegex.test(form.house.trim())) errors.house = m.validationHouse;
  if (form.flat && !safeTextRegex.test(form.flat.trim())) errors.flat = m.validationFlat;
  if (form.deliverAtTime) {
    const start = new Date(`${form.deliveryDate}T${form.deliveryStartTime}`);
    if (!form.deliveryDate) errors.deliveryDate = m.validationDeliveryDate;
    if (!form.deliveryStartTime) errors.deliveryStartTime = m.validationDeliveryTime;
    if (Number.isNaN(start.getTime()) || start <= new Date()) errors.deliveryStartTime = m.validationDeliveryFuture;
  }
  return errors;
};

export const validateUserForm = (
  form: { name: string; email: string; phone: string; role: string },
  language: Language = 'ru',
) => {
  const m = messages(language);
  const errors: ValidationErrors = {};
  if (!nameRegex.test(form.name.trim())) errors.name = m.validationName;
  if (!emailRegex.test(form.email.trim())) errors.email = m.validationEmail;
  if (form.phone && !phoneRegex.test(form.phone.trim())) errors.phone = m.validationPhone;
  if (!['customer', 'admin'].includes(form.role)) errors.role = m.validationRole;
  return errors;
};

export const validateProductForm = (
  form: {
    name: string;
    nameEn: string;
    price: string;
    stock: string;
    CategoryId: string;
    weight: string;
    description: string;
    descriptionEn: string;
  },
  language: Language = 'ru',
) => {
  const m = messages(language);
  const errors: ValidationErrors = {};
  if (!safeTextRegex.test(form.name.trim())) errors.name = m.validationProductName;
  if (form.nameEn.trim() && !safeTextRegex.test(form.nameEn.trim())) errors.nameEn = m.validationProductNameEn;
  if (form.description.trim().length < 5 || form.description.trim().length > 500) errors.description = m.validationDescription;
  if (form.descriptionEn.trim() && (form.descriptionEn.trim().length < 5 || form.descriptionEn.trim().length > 500)) {
    errors.descriptionEn = m.validationDescriptionEn;
  }
  if (!isPositiveNumber(form.price)) errors.price = m.validationPrice;
  if (!isNonNegativeInteger(form.stock)) errors.stock = m.validationStock;
  if (!form.CategoryId) errors.CategoryId = m.validationCategory;
  if (form.weight && !weightRegex.test(form.weight.trim())) errors.weight = m.validationWeight;
  return errors;
};
