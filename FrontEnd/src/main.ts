import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).mount("#app");
console.log("PORT : ", import.meta.env.VITE_API_BASE);
