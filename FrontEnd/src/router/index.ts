// *** ไฟล์นี้คือ การตั้งค่าเส้นทาง (Router) ของแอปพลิเคชัน Vue.js ***// 
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { decodeJWT } from '../utils/jwt';

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
        component : () => import('../views/AdminProductsListView.vue'), 
        meta : { requiresAuth : true , roles : ['Admin'] }, 
      }
    ]
  }, 
  {
    path : "/admin/login",
    component: () => import('../layouts/AdminLayout.vue'), 
    children: [
      {
        path : "", 
        name : "AdminLogin",
        component : () => import('../views/LoginAdminView.vue'), 
        meta : { public : true }, // กำหนดว่าเส้นทางนี้เป็นสาธารณะ (ไม่ต้องล็อกอิน)
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
        meta : { requiresAuth : true , roles : ['User','Admin'] }, 
      }
    ]
  }
]; 

// --- ส่วนนี้คือ การสร้างอินสแตนซ์ของ Router สามารถจัดการเส้นทางในแอปพลิเคชัน --- //
export const router = createRouter({
  history: createWebHistory(),
  routes, 
});

// --- ส่วนนี้คือ การตรวจสอบก่อนเปลี่ยนเส้นทาง (Navigation Guard) --- //
router.beforeEach((to) => { 
  const isPublic = to.matched.some(record => record.meta.public); // ตรวจสอบว่าเส้นทางที่ไปเป็นสาธารณะหรือไม่ 
  const needsAuth = to.matched.some(record => record.meta.requiresAuth); // ตรวจสอบว่าเส้นทางที่ไปต้องการการพิสูจน์ตัวตนหรือไม่
  const roles = (to.matched.find(record => record.meta.roles)?.meta.roles) as string[] | undefined; // ดึงบทบาทที่อนุญาตจากเมตาดาต้า)

  const token = localStorage.getItem("token"); // ดึงโทเค็นการพิสูจน์ตัวตนจาก localStorage
  const hasToken = !!token; // ตรวจสอบว่ามีโทเค็นหรือไม่

  if(needsAuth && !hasToken) { // ต้องยืนยันตัวตน และ ไม่มีโทเค็น ให้เปลี่ยนเส้นทางไปที่หน้าเข้าสู่ระบบ
    return { name : 'Login'};
  }

  if (hasToken && roles) {
    const payload : any = decodeJWT(token!); // ถอดรหัส JWT เพื่อดึงข้อมูล payload
    let role = payload?.role ?? payload?.roles?.[0]; // สมมติว่า role อยู่ใน payload ของ JWT 
    if (typeof role === 'string') role = role[0]?.toUpperCase() + role.slice(1).toLowerCase(); // ปรับรูปแบบ role ให้ตรงกับที่กำหนดในเมตาดาต้า

    // ถ้าไม่มีสิทธิ์ ก็ส่งไปหน้า default ของ rold นั้นๆ
    if(roles && !roles.includes(role)) {
      return role === 'Admin' ? { name : 'AdminProducts' } : { name : 'UserProducts' }; 
    }
    
  }

  // ถ้าเส้นทางไม่ใช่สาธารณะและไม่มีโทเค็น ให้เปลี่ยนเส้นทางไปที่หน้าเข้าสู่ระบบ
  if (!isPublic && !hasToken) {
    return { name : "Login" }; 
  }
});

