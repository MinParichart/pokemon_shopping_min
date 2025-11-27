// import { reactive } from 'vue';
// import type { RegisterUser } from '../models/auth.model';

// const state = reactive<{ registerUser: RegisterUser | null, loggedIn:boolean }>({
//   registerUser: null,
//   loggedIn: false,  
// });

// export function useAuth() {
//   function setToken(token: string) {
//     localStorage.setItem('token', token);
//   }


// function getToken() : string | null {
//   return localStorage.getItem('token');
// }

// function setUser(user: RegisterUser) {
//   state.registerUser = user;
//   state.loggedIn = true;
// }

// function logout() {
//   localStorage.removeItem('token');
//   state.registerUser = null;
//   state.loggedIn = false;
// }


// return { setToken, getToken, setUser, logout, state };

// }

import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export function useAuth() {
  const auth = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  async function loginUser(username: string, password: string) {
    await auth.loginUser({ username, password });
    const redirect = (route.query.redirect as string) || '/products';
    await router.replace(redirect);
  }

  async function loginAdmin(username: string, password: string) {
    await auth.loginAdmin({ username, password });

    const redirect = route.query.redirect as string | undefined;
    const target =
      redirect && redirect.startsWith('/admin')
        ? redirect
        : '/admin/orders';

    await router.replace(target);
  }

  function logoutToLogin() {
    auth.logout();
    router.push('/login');
  }

  function logoutToAdminLogin() {
    auth.logout();
    router.push('/admin/login');
  }

  return {
    auth,
    loginUser,
    loginAdmin,
    logoutToLogin,
    logoutToAdminLogin
  };
}
