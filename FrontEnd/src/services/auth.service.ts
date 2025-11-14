// *** ไฟล์นี้คือ การเรียกใช้งาน API ที่เกี่ยวกับการยืนยันตัวตน (Authentication) *** //

import type { LoginBody, LoginResponse } from "../models/auth.model";
import { httpClient } from "./http.service";

// --- ฟังก์ชันสำหรับล็อกอิน --- //
export const login = async (body: LoginBody): Promise<LoginResponse> => {
  const response = await httpClient.post<LoginResponse>("/api/auth/login",body);
  return response.data;
};

// --- ฟังก์ชันสำหรับล็อกอิน สำหรับ destructure data --- //
// export const login = async (body: LoginBody): Promise<LoginResponse> => {
//   const { data } = await httpClient.post<LoginResponse>("/api/auth/login",body);
//   return data;
// };

