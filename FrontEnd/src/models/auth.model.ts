export interface LoginBody {
  username: string;
  password: string;
}

export interface RegisterBody{
  username: string;
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

// เพิ่ม extends 
// export interface RegisterBody extends LoginBody{
//   fullName: string;
//   phone: string;
//   confirmPassword: string;
//   role: string;
// }

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  sub?: string;
  username?: string;
  fullName?: string;
  phone?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
}
