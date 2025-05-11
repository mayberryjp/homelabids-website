import type { RouteRecordRaw } from "vue-router";
import ErrorView from "@/views/ErrorView.vue";

const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/error",
    name: "error",
    component: ErrorView,
    props: (route: any) => ({
      title: route.query.title,
      message: route.query.message,
      errorCode: route.query.errorCode,
      errorImage: route.query.errorImage,
    }),
  },
  // Specific error pages
  {
    path: "/403",
    name: "forbidden",
    component: ErrorView,
    props: {
      title: "Access Denied",
      message: "You don't have permission to access this resource.",
      errorCode: "403",
    },
  },
  {
    path: "/404",
    name: "not-found",
    component: ErrorView,
    props: {
      title: "Page Not Found",
      message: "The page you are looking for doesn't exist or has been moved.",
      errorCode: "404",
    },
  },
  {
    path: "/500",
    name: "server-error",
    component: ErrorView,
    props: {
      title: "Server Error",
      message: "Something went wrong on our end. Please try again later.",
      errorCode: "500",
    },
  },
  // Catch-all 404 route
  {
    path: "/:pathMatch(.*)*",
    name: "not-found-catch-all",
    redirect: { name: "not-found" },
  },
];

export default errorRoutes;
