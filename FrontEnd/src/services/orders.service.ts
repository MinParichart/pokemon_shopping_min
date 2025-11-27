import httpClient from './http.service';
import type { Order } from '../models/order.model';

export interface CreateOrderBody {
  shippingAddress: string;
  orderDetails: {
    productId: number;
    quantity: number;
  }[];
}

export interface UpdateOrderBody {
  status: string;
}

export const ordersService = {
  getOrders() {
    return httpClient.get<Order[]>('/api/orders').then((r) => r.data);
  },
  createOrder(body: CreateOrderBody) {
    return httpClient.post<Order>('/api/orders', body).then((r) => r.data);
  },
  updateOrder(orderId: number, body: UpdateOrderBody) {
    return httpClient.put<Order>(`/api/orders/${orderId}`, body).then((r) => r.data);
  }
};
