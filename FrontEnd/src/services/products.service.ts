import type { Product, ProductQuery } from "../models/product.model";
import { httpClient } from "./http.service";

// ดึงข้อมูลสินค้าจาก API โดยใช้ query parameters ที่ระบุใน ProductQuery
export async function getProducts(query?: ProductQuery): Promise<Product[]>{
  const { data } = await httpClient.get<Product[]>('/products', { params: query });
  return data;
}