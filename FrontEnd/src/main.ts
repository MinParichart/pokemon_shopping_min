import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router/index.ts";
import "./style.css";

createApp(App).use(router).mount("#app");

// debug ดูค่า env
console.log("PORT : ", import.meta.env.VITE_API_BASE);
