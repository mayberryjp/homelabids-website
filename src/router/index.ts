import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/auth/LoginView.vue";
import RegistrationView from "@/views/auth/RegistrationView.vue";
import ExploreView from "@/views/ExploreView.vue";
import SettingsView from "@/views/SettingsView.vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import DashboardView from "@/views/DashboardView.vue";

const privateRoutes = [
  {
    path: "/app",
    component: AppLayout,
    children: [
      { path: "", component: DashboardView },
      { path: "explore", component: ExploreView },
      { path: "settings", component: SettingsView },
    ],
  },
];

const publicRoutes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegistrationView },
];

const routes = [...publicRoutes, ...privateRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
