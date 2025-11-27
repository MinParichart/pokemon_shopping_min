import type { LoginBody, LoginResponse, RegisterBody } from '../models/auth.model';
import httpClient from './http.service';

export const authService = {
  loginUser(body: LoginBody) {
    return httpClient.post<LoginResponse>('/api/auth/login', body).then((r) => r.data);
  },
  register(body: RegisterBody) {
    return httpClient.post<void>('/api/auth/register', body).then((r) => r.data);
  },

  loginAdmin(body: LoginBody) {
    // ✅ ใช้ Basic Auth แทน query params
    return httpClient
      .get<LoginResponse>('/api/admin/login', {
        auth: {
          username: body.username,
          password: body.password
        }
      })
      .then((r) => r.data);
  }
};
