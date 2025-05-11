import type { RouteRecordRaw } from "vue-router";
import LoginView from "@/views/auth/LoginView.vue";
import RegistrationView from "@/views/auth/RegistrationView.vue";

const publicRoutes: RouteRecordRaw[] = [
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegistrationView },
];

export default publicRoutes;
