import httpClient from './http.service';
import type { Product, ProductPayload } from '../models/product.model';

export const productsService = {
  getProducts() {
    return httpClient.get<Product[]>('/api/products').then((r) => r.data);
  },
  getProduct(id: number) {
    return httpClient.get<Product>(`/api/products/${id}`).then((r) => r.data);
  },
  createProduct(payload: ProductPayload) {
    return httpClient
      .post<Product>('/api/products', payload)
      .then((r) => r.data);
  },
  updateProduct(id: number, payload: ProductPayload) {
    return httpClient
      .put<Product>(`/api/products/${id}`, payload)
      .then((r) => r.data);
  },
  deleteProduct(id: number) {
    return httpClient.delete<void>(`/api/products/${id}`).then((r) => r.data);
  },
};
