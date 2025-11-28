import type { Product } from './product.model';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CANCELLED'
  | string;

export interface OrderDetail {
  id?: number;
  productId: number;
  quantity: number;
  product?: Product; // กรณีอนาคต backend ส่ง product แบบ object มา
  price?: number;

  // 👇 เพิ่มพวก field ที่มาจาก API ตอนนี้
  productName?: string;
  productImageUrl?: string;
  productDescription?: string;
  productCategory?: string;
}

export interface Order {
  id: number;
  orderCode?: string;
  shippingAddress: string;
  status: OrderStatus;
  totalAmount?: number;
  createdAt?: string;
  orderDetails: OrderDetail[];
  username?: string;
  fullName?: string;
  phone?: string;
}
