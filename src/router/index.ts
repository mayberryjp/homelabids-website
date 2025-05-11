import { createRouter, createWebHistory } from "vue-router";
import privateRoutes from "./routes/privateRoutes";
import publicRoutes from "./routes/publicRoutes";
import errorRoutes from "./routes/errorRoutes";

const routes = [...publicRoutes, ...privateRoutes, ...errorRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global error handling
router.onError((error) => {
  console.error("Router error:", error);
  router.push({
    name: "error",
    query: {
      title: "Navigation Error",
      message: "An error occurred while loading the page.",
      errorCode: "500",
    },
  });
});

export default router;
