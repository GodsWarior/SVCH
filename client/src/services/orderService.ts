import { AddressPayload } from '../types';
import { http } from './http';

export const orderApi = {
  getAll: () => http.get('/orders').then((response) => response.data),
  create: (payload: {
    address: AddressPayload;
    deliverySlot: string;
    paymentMethod: string;
    items: Array<{ productId: number; quantity: number }>;
  }) => http.post('/orders', payload).then((response) => response.data),
  updateStatus: (id: number, status: string) => http.patch(`/orders/${id}/status`, { status }).then((response) => response.data),
};
