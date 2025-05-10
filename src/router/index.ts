import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/auth/LoginView.vue";
import RegistrationView from "@/views/auth/RegistrationView.vue";
import LandingView from "@/views/LandingView.vue";
import ExploreView from "@/views/ExploreView.vue";
import SettingsView from "@/views/SettingsView.vue";

const routes = [
  { path: "/", component: LandingView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegistrationView },
  { path: "/explore", component: ExploreView },
  { path: "/settings", component: SettingsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
