import { reactive } from 'vue';
import type { RegisterUser } from '../models/auth.model';

const state = reactive<{ registerUser: RegisterUser | null, loggedIn:boolean }>({
  registerUser: null,
  loggedIn: false,  
});

export function useAuth() {
  function setToken(token: string) {
    localStorage.setItem('token', token);
  }


function getToken() : string | null {
  return localStorage.getItem('token');
}

function setUser(user: RegisterUser) {
  state.registerUser = user;
  state.loggedIn = true;
}

function logout() {
  localStorage.removeItem('token');
  state.registerUser = null;
  state.loggedIn = false;
}


return { setToken, getToken, setUser, logout, state };

}