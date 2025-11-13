// *** ไฟล์นี้คือ การตั้งค่าเส้นทาง (Router) ของแอปพลิเคชัน Vue.js ***// 
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// --- ส่วนนี้คือ การตั้งค่าเส้นทางต่าง ๆ ในแอปพลิเคชัน --- //
const routes : RouteRecordRaw[] = [
  { 
    path : "/login",  // เส้นทางสำหรับหน้าเข้าสู่ระบบ
    component: () => import('../layouts/AuthLayout.vue'), // ใช้เลย์เอาต์สำหรับการพิสูจน์ตัวตน
    children: [ // เส้นทางลูกภายในเลย์เอาต์นี้
      {
        path : "", // เส้นทางย่อยที่ว่างเปล่า หมายถึง /login
        name : "Login", // ชื่อเส้นทางคือ "Login"
        component : () => import('../views/LoginView.vue'), // นำเข้าและแสดงคอมโพเนนต์หน้าเข้าสู่ระบบ
        meta : { public : true }, // กำหนดว่าเส้นทางนี้เป็นสาธารณะ (ไม่ต้องล็อกอิน)
      }
    ]
  }, 
  {
    path : "/admin",
    component: () => import('../layouts/AdminLayout.vue'), 
    children: [
      {
        path : "", 
        name : "AdminProducts",
        component : () => import('../views/AdminView.vue'), 
        meta : { public : true }, 
      }
    ]
  }, 
  {
    path : "/products",
    component: () => import('../layouts/UserLayout.vue'), 
    children: [
      {
        path : "", 
        name : "UserProducts",
        component : () => import('../views/UserProductsListView.vue'), 
        meta : { public : true }, 
      }
    ]
  }
]; 

// ส่วนนี้คือ การสร้างอินสแตนซ์ของ Router สามารถจัดการเส้นทางในแอปพลิเคชัน
export const router = createRouter({
  history: createWebHistory(),
  routes, 
});

// ส่วนนี้คือ การตรวจสอบก่อนเปลี่ยนเส้นทาง (Navigation Guard)
router.beforeEach((to) => { 
  const isPublic = to.matched.some(record => record.meta.public); // ตรวจสอบว่าเส้นทางที่ไปเป็นสาธารณะหรือไม่
  const hasToken = !!localStorage.getItem("token"); // ตรวจสอบว่ามีโทเค็นการพิสูจน์ตัวตนใน localStorage หรือไม่
  console.log('[guard]' , to.fullPath, { isPublic, hasToken }); // ดูค่าการตรวจสอบในคอนโซล

  // ถ้าเส้นทางไม่ใช่สาธารณะและไม่มีโทเค็น ให้เปลี่ยนเส้นทางไปที่หน้าเข้าสู่ระบบ
  if (!isPublic && !hasToken) {
    return { name : "Login" }; 
  }
});

