import type { RouteRecordRaw } from "vue-router";
import AppLayout from "@/components/layout/AppLayout.vue";
import DashboardView from "@/views/DashboardView.vue";
import ExploreView from "@/views/ExploreView.vue";
import SettingsView from "@/views/SettingsView.vue";

const privateRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", name: "dashboard", component: DashboardView },
      { path: "explore", name: "explore", component: ExploreView },
      { path: "settings", name: "settings", component: SettingsView },
    ],
  },
];

export default privateRoutes;
