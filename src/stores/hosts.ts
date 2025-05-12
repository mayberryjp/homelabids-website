import { getLocalhosts, getAlertSummary } from "@/services/alerts";
import type { Localhost } from "@/types/localhosts";
import type { AlertsSummary } from "@/types/alerts";
import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

export const useHostsStore = defineStore("hosts", () => {
  const localhosts = ref<Localhost[]>([]);
  const alertsSummary = ref<AlertsSummary>([]);

  const fetchLocalhosts = async () => {
    try {
      const response = await getLocalhosts();
      localhosts.value = response.data;
    } catch (error) {
      console.error("Error fetching localhosts:", error);
      throw error;
    }
  };

  const fetchAlertSummary = async () => {
    try {
      const response = await getAlertSummary();
      alertsSummary.value = response;
    } catch (error) {
      console.error("Error fetching alert summary:", error);
      throw error;
    }
  };

  onMounted(() => {
    fetchLocalhosts();
    fetchAlertSummary();
  });

  return { localhosts, alertsSummary, fetchLocalhosts, fetchAlertSummary };
});
