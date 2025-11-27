import { defineStore } from 'pinia';
import type { JwtPayload, LoginBody } from '../models/auth.model';
import { authService } from '../services/auth.service';
import { decodeJWT, isTokenExpired } from '../utils/jwt';

interface AuthState {
  token: string | null;
  payload: JwtPayload | null;
  // ✅ เพิ่ม flag สำหรับแยกว่า login ผ่าน admin หรือไม่
  isAdminLogin: boolean;
}

const TOKEN_KEY = 'pokemon_token';
const ADMIN_FLAG_KEY = 'pokemon_admin_login';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem(TOKEN_KEY),
    payload: null,
    // โหลด flag จาก localStorage เผื่อรีเฟรชหน้า
    isAdminLogin: localStorage.getItem(ADMIN_FLAG_KEY) === '1'
  }),
  getters: {
    isAuthenticated(state): boolean {
      if (!state.token) return false;
      if (!state.payload) return true;
      return !isTokenExpired(state.payload);
    },
    role(state): string | undefined {
      return state.payload?.role;
    },
    isAdmin(): boolean {
      // 🔥 ถ้าเคย login ผ่าน /admin/login ให้ถือว่าเป็น admin ทันที
      if (this.isAdminLogin) return true;
      // รองรับกรณีมี role ใน token ด้วย
      return this.role === 'admin';
    },
    username(state): string | undefined {
      return state.payload?.username ?? state.payload?.sub;
    }
  },
  actions: {
    initFromToken() {
      if (!this.token) {
        this.payload = null;
        return;
      }
      this.payload = decodeJWT(this.token);
      if (isTokenExpired(this.payload)) {
        this.logout();
      }
    },
    setToken(token: string | null) {
      this.token = token;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      this.initFromToken();
    },

    async loginUser(body: LoginBody) {
      const resp = await authService.loginUser(body);
      // ✅ ผู้ใช้ธรรมดา → ไม่ใช่ admin
      this.isAdminLogin = false;
      localStorage.setItem(ADMIN_FLAG_KEY, '0');
      this.setToken(resp.token);
    },

    async loginAdmin(body: LoginBody) {
      const resp = await authService.loginAdmin(body);
      // ✅ login ผ่าน admin โดยตรง → ถือว่าเป็น admin แน่นอน
      this.isAdminLogin = true;
      localStorage.setItem(ADMIN_FLAG_KEY, '1');
      this.setToken(resp.token);
    },

    logout() {
      this.setToken(null);
      // ✅ เคลียร์สถานะ admin ด้วย
      this.isAdminLogin = false;
      localStorage.setItem(ADMIN_FLAG_KEY, '0');
    }
  }
});
