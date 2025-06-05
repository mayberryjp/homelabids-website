import { defineStore } from "pinia";
import { ref } from "vue";
import type { Anchor } from "vuetify";

export const useNotificationStore = defineStore("notification", () => {
  const snackbar = ref({
    show: false,
    text: "",
    color: "success",
    timeout: 3000,
    location: "bottom" as Anchor,
  });

  const showNotification = (
    text: string,
    color: string = "success",
    timeout: number = 3000,
    location: Anchor = "bottom"
  ) => {
    snackbar.value = {
      show: true,
      text,
      color,
      timeout,
      location,
    };
  };

  const showSuccess = (text: string) => {
    showNotification(text, "success");
  };

  const showError = (text: string) => {
    showNotification(text, "error");
  };

  const showInfo = (text: string) => {
    showNotification(text, "info");
  };

  const showWarning = (text: string) => {
    showNotification(text, "warning");
  };

  const hideNotification = () => {
    snackbar.value.show = false;
  };

  return {
    snackbar,
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideNotification,
  };
});
