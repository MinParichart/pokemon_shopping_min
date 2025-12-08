// composable สำหรับจัดการเรื่อง auth (login / logout) ร่วมกับ router
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export function useAuth() {
  // store กลางที่เก็บ token / payload / role
  const auth = useAuthStore();
  // ใช้สำหรับเปลี่ยนหน้า
  const router = useRouter();
  // ใช้อ่าน query params เช่น ?redirect=/xxx
  const route = useRoute();

  // ฟังก์ชัน login สำหรับ user ทั่วไป
  async function loginUser(username: string, password: string) {
    // เรียก store ให้ไปยิง API / เก็บ token
    await auth.loginUser({ username, password });

    // ถ้า URL มี redirect ?redirect=/something ให้กลับไปหน้านั้น
    // ถ้าไม่มี ให้ไปหน้า /products
    const redirect = (route.query.redirect as string) || '/products';
    await router.replace(redirect);
  }

  // ฟังก์ชัน login สำหรับ admin
  async function loginAdmin(username: string, password: string) {
    // ยิง API login admin และเก็บ token ผ่าน store
    await auth.loginAdmin({ username, password });

    // อ่าน redirect จาก query (ถ้ามี)
    const redirect = route.query.redirect as string | undefined;

    // ถ้า redirect เริ่มด้วย /admin ให้ไปตามนั้น
    // ถ้าไม่มี / ไม่ใช่ /admin ให้วิ่งไปหน้า default คือ /admin/orders
    const target =
      redirect && redirect.startsWith('/admin') ? redirect : '/admin/orders';

    await router.replace(target);
  }

  // logout แล้วพาไปหน้า login ของ user
  function logoutToLogin() {
    auth.logout();          // เคลียร์ token / payload
    router.push('/login');  // เปลี่ยน route
  }

  // logout แล้วพาไปหน้า login ของ admin
  function logoutToAdminLogin() {
    auth.logout();
    router.push('/admin/login');
  }

  // คืน object ที่เอาไปใช้ใน component อื่น ๆ
  return {
    auth,               // ให้ component เอาไปใช้เช็ค isAuthenticated / isAdmin ได้
    loginUser,          // ฟังก์ชัน login user
    loginAdmin,         // ฟังก์ชัน login admin
    logoutToLogin,      // logout user
    logoutToAdminLogin, // logout admin
  };
}
