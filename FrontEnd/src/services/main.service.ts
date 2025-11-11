// *** ไฟล์นี้ใช้สำหรับตั้งค่า axios เพื่อเรียก API ต่างๆ *** //

// --- ส่วนนี้คือ การตั้งค่า axios เพื่อใช้ในการเรียก API --- //
import axios from "axios";

// --- ส่วนนี้คือ การตั้งค่า axios instance เพื่อใช้เรียก API
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // อ่านจาก .env
  timeout: 15000, // 15 วินาที
});

// --- ส่วนนี้คือ การแนบ token อัตโนมัติในทุกคำขอ --- //
httpClient.interceptors.request.use((config) => {
  // interceptors คือ ตัวดักจับคำขอก่อนส่ง
  const token = localStorage.getItem("token"); // ดึง token จาก localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // แนบ token ใน header
  }
  return config;
});

// --- ส่วนนี้คือ การจัดการกับ response ที่ได้รับ --- //
httpClient.interceptors.response.use(
  (response) => {
    return response; // ถ้าคำขอสำเร็จ ให้ส่ง response กลับไป
  },
  (error) => {
    // ถ้าคำขอล้มเหลว เช่น token หมดอายุ
    if (error.response && error.response.status === 401) {
      // จัดการกรณี token หมดอายุ เช่น ลบ token ออกจาก localStorage
      localStorage.removeItem("token");
      // หรือเปลี่ยนเส้นทางไปยังหน้าล็อกอิน
      window.location.href = "/login";
    }
    return Promise.reject(error); // ส่ง error กลับไป
  }
);
