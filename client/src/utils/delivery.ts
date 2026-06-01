import type { Language } from './i18n';
import { translations } from './i18n';

const padTime = (value: number) => String(value).padStart(2, '0');

export const toDateInputValue = (date: Date) => (
  `${date.getFullYear()}-${padTime(date.getMonth() + 1)}-${padTime(date.getDate())}`
);

const toTimeInputValue = (date: Date) => `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;

export const getDefaultDeliveryTimes = () => {
  const start = new Date();
  start.setHours(start.getHours() + 1, 0, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return {
    date: toDateInputValue(start),
    startTime: toTimeInputValue(start),
    endTime: toTimeInputValue(end),
  };
};

const addOneHourTime = (date: string, time: string) => {
  const end = new Date(`${date}T${time}`);
  end.setHours(end.getHours() + 1);
  return toTimeInputValue(end);
};

export const formatDeliverySlot = (date: string, startTime: string, language: Language = 'ru') => {
  const endTime = addOneHourTime(date, startTime);
  const today = toDateInputValue(new Date());
  const dateLabel = date === today
    ? translations[language].today
    : new Date(`${date}T00:00:00`).toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU');
  return `${dateLabel} ${startTime}-${endTime}`;
};
