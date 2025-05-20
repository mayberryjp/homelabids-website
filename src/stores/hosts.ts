import { getAlertSummary, getRecentAlerts } from "@/services/alerts";
import type { Localhost } from "@/types/localhosts";
import type { Alert, AlertsSummaryStore } from "@/types/alerts";
import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { getLocalhosts } from "@/services/hosts";

export const useHostsStore = defineStore("hosts", () => {
  const localhosts = ref<Localhost[]>([]);
  const alertsSummary = ref<AlertsSummaryStore>({});
  const alertsRecent = ref<Alert[]>([]);

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

  const fetchRecentAlerts = async () => {
    try {
      const response = await getRecentAlerts();
      alertsRecent.value = response;
    } catch (error) {
      console.error("Error fetching recent alerts:", error);
      throw error;
    }
  };

  onMounted(() => {
    fetchLocalhosts();
    fetchAlertSummary();
    fetchRecentAlerts();
  });

  return {
    localhosts,
    alertsSummary,
    alertsRecent,
    fetchLocalhosts,
    fetchAlertSummary,
    fetchRecentAlerts,
  };
});
