export type ValidationErrors = Record<string, string>;

const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]{2,60}$/;
const phoneRegex = /^\+?\d{10,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const safeTextRegex = /^[A-Za-zА-Яа-яЁё0-9\s.,'"№/-]{1,120}$/;
const weightRegex = /^[A-Za-zА-Яа-яЁё0-9\s.,/-]{1,40}$/;

const isPositiveNumber = (value: string) => Number.isFinite(Number(value)) && Number(value) > 0;
const isNonNegativeInteger = (value: string) => /^\d+$/.test(value) && Number(value) >= 0;

export const validateAuth = (form: { name: string; email: string; phone: string; password: string }, mode: 'login' | 'register') => {
  const errors: ValidationErrors = {};
  const email = form.email.trim();

  if (!emailRegex.test(email)) {
    errors.email = 'Введите корректный email';
  }
  if (form.password.length < (mode === 'register' ? 8 : 1)) {
    errors.password = mode === 'register' ? 'Минимум 8 символов' : 'Введите пароль';
  }
  if (mode === 'register') {
    if (!nameRegex.test(form.name.trim())) {
      errors.name = 'Имя: 2-60 букв, можно дефис';
    }
    if (form.phone && !phoneRegex.test(form.phone.trim())) {
      errors.phone = 'Телефон: только цифры, можно +, 10-15 знаков';
    }
  }

  return errors;
};

export const validateAddress = (form: {
  city: string;
  street: string;
  house: string;
  flat: string;
  deliverAtTime: boolean;
  deliveryDate: string;
  deliveryStartTime: string;
}) => {
  const errors: ValidationErrors = {};
  if (!safeTextRegex.test(form.city.trim())) errors.city = 'Введите корректный город';
  if (!safeTextRegex.test(form.street.trim())) errors.street = 'Введите корректную улицу';
  if (!safeTextRegex.test(form.house.trim())) errors.house = 'Введите корректный номер дома';
  if (form.flat && !safeTextRegex.test(form.flat.trim())) errors.flat = 'Введите корректный номер квартиры';
  if (form.deliverAtTime) {
    const start = new Date(`${form.deliveryDate}T${form.deliveryStartTime}`);
    if (!form.deliveryDate) errors.deliveryDate = 'Выберите дату доставки';
    if (!form.deliveryStartTime) errors.deliveryStartTime = 'Выберите время доставки';
    if (Number.isNaN(start.getTime()) || start <= new Date()) errors.deliveryStartTime = 'Время доставки должно быть в будущем';
  }
  return errors;
};

export const validateUserForm = (form: { name: string; email: string; phone: string; role: string }) => {
  const errors: ValidationErrors = {};
  if (!nameRegex.test(form.name.trim())) errors.name = 'Имя: 2-60 букв, можно дефис';
  if (!emailRegex.test(form.email.trim())) errors.email = 'Введите корректный email';
  if (form.phone && !phoneRegex.test(form.phone.trim())) errors.phone = 'Телефон: только цифры, можно +, 10-15 знаков';
  if (!['customer', 'admin'].includes(form.role)) errors.role = 'Выберите корректную роль';
  return errors;
};

export const validateProductForm = (form: {
  name: string;
  nameEn: string;
  price: string;
  stock: string;
  CategoryId: string;
  weight: string;
  description: string;
  descriptionEn: string;
}) => {
  const errors: ValidationErrors = {};
  if (!safeTextRegex.test(form.name.trim())) errors.name = 'Название: 1-120 допустимых символов';
  if (form.nameEn.trim() && !safeTextRegex.test(form.nameEn.trim())) errors.nameEn = 'English name: 1-120 valid characters';
  if (form.description.trim().length < 5 || form.description.trim().length > 500) errors.description = 'Описание: 5-500 символов';
  if (form.descriptionEn.trim() && (form.descriptionEn.trim().length < 5 || form.descriptionEn.trim().length > 500)) errors.descriptionEn = 'English description: 5-500 characters';
  if (!isPositiveNumber(form.price)) errors.price = 'Цена должна быть больше 0';
  if (!isNonNegativeInteger(form.stock)) errors.stock = 'Остаток должен быть целым числом от 0';
  if (!form.CategoryId) errors.CategoryId = 'Выберите категорию';
  if (form.weight && !weightRegex.test(form.weight.trim())) errors.weight = 'Некорректный вес';
  return errors;
};
