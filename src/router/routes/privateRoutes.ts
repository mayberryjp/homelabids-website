import type { RouteRecordRaw } from "vue-router";
import AppLayout from "@/components/layout/AppLayout.vue";
import DashboardView from "@/views/DashboardView.vue";
import ExploreView from "@/views/ExploreView.vue";
import SettingsView from "@/views/SettingsView.vue";
import HostDetailsView from "@/views/HostDetailsView.vue";
import DocumentationView from "@/views/DocumentationView.vue";

const privateRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", name: "dashboard", component: DashboardView },
      { path: "explore", name: "explore", component: ExploreView },
      { path: "settings", name: "settings", component: SettingsView },
      { path: "host/:ip_address", name: "host", component: HostDetailsView },
      { path: "documentation", name: "documentation", component: DocumentationView },
    ],
  },
];

export default privateRoutes;
