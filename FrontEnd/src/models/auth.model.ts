// *** ไฟล์นี้ใช้สำหรับเก็บ model ที่เกี่ยวข้องกับการยืนยันตัวตน (authentication) *** //

// --- ส่วนนี้คือ model สำหรับการรับข้อมูลผู้ใช้ที่ล็อกอิน ---//
export interface LoginBody {
  username: string;
  password: string;
}

// --- ส่วนนี้คือ model สำหรับการรับข้อมูลการตอบกลับหลังจากล็อกอิน ---//
export interface LoginResponse {
  token: string;
  login: LoginBody;
}
// --- ส่วนนี้คือ model สำหรับการรับข้อมูลการลงทะเบียนผู้ใช้ใหม่ ---//
export interface RegisterUser {
  username: string;
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

// --- ส่วนนี้คือ model สำหรับการรับข้อมูลการตอบกลับหลังจากลงทะเบียน ---//
export interface RegisterResponse {
  message: string;
}

// --- ส่วนนี้คือ model สำหรับการเปลี่ยนรหัสผ่าน ---//
export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// --- ส่วนนี้คือ model สำหรับการตอบกลับหลังจากเปลี่ยนรหัสผ่าน ---//
export interface ChangePasswordResponse {
  message: string;
}

// --- ส่วนนี้คือ model สำหรับการรีเซ็ตรหัสผ่าน ---//
export interface ResetPassword {
  username: string;
  phone: string;
  newPassword: string;
  confirmNewPassword: string;
}

// --- ส่วนนี้คือ model สำหรับการตอบกลับหลังจากรีเซ็ตรหัสผ่าน ---//
export interface ResetPasswordResponse {
  message: string;
}

// --- ส่วนนี้คือ model สำหรับการตรวจสอบโทเค็น ---//
export interface VerifyTokenResponse {
  valid: boolean;
}

// --- ส่วนนี้คือ model สำหรับการตอบกลับข้อผิดพลาด ---//
export interface ErrorResponse {
  message: string;
}
