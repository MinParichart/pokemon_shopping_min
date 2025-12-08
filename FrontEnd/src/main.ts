import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.ts';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app'); 

// debug ดูค่า env
console.log('PORT : ', import.meta.env.VITE_API_BASE);
