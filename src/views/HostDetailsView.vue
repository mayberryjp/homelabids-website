<template>
  <div>
    <div v-if="isLoading">
      <AppLoader v-if="true" type="logo" label="Loading..." />
    </div>

    <div v-else-if="localHostDetail" class="host-details">
      <!-- Host Header Section -->
      <v-card color="#0d1117" class="mb-4">
        <v-card-text>
          <div class="d-flex flex-column flex-wrap">
            <!-- Host Title -->
            <div class="d-flex align-center justify-space-between">
              <div class="host-title me-4">
                <h2 class="text-h4 text-grey custom-heading">
                  {{ localHostDetail.local_description || "Unnamed" }}
                </h2>
                <div class="text-subtitle-1 text-green">
                  IP Address: {{ ip_address }}
                </div>
              </div>

              <!-- Add HostActions component here -->
              <HostActions :ip-address="ip_address" />
            </div>

            <div v-if="alertDetail">
              <AlertBars 
                :alert-intervals="alertDetail.alert_intervals" 
                class="ml-auto" 
                :height="26" 
                :width="7"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card color="#0d1117" class="mb-4">
        <HostStats :host-detail="localHostDetail" />
      </v-card>

      <!-- Traffic Stats -->
      <v-card color="#0d1117" v-if="trafficStats" class="pa-2 mb-4">
        <v-card-title class="text-white"
          >Network Traffic Statistics</v-card-title
        >
        <v-card-subtitle class="text-grey"
          >Displaying total bytes and packets over time</v-card-subtitle
        >
        <HostAlertsChart :traffic-stats="trafficStats" />
      </v-card>

      <!-- Host-specific Alerts -->
      <v-card color="#0d1117" v-if="recentHostAlerts.length" class="mb-4">
        <RecentAlerts
          :alerts="recentHostAlerts"
          title="Host Alerts"
          :items-per-page="10"
          :showRefreshButton="true"
          :loading="recentAlertsLoading"
          @refresh="fetchRecentHostAlerts(ip_address)"
        />
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLocalhostDetail, getLocalhostTraffic } from "@/services/hosts";
import { useRoute } from "vue-router";
import { onMounted, watch, ref } from "vue";
import AppLoader from "@/components/base/AppLoader.vue";
import type { Localhost } from "@/types/localhosts";
import { getHostAlertDetails, getHostRecentAlerts } from "@/services/alerts";
import HostAlertsChart from "@/components/host-details/HostAlertsChart.vue";
import RecentAlerts from "@/components/dashboard/RecentAlerts.vue";
import type { Alert, AlertDetail } from "@/types/alerts";
import HostStats from "@/components/host-details/HostStats.vue";
import HostActions from "@/components/host-details/HostActions.vue";
import AlertBars from "@/components/base/AlertBars.vue";

const route = useRoute();
const ip_address = ref(route.params.ip_address as string);
const localHostDetail = ref<Localhost | null>(null);
const alertDetail = ref<AlertDetail | null>(null);
const trafficStats = ref(null);
const isLoading = ref(true);
const recentHostAlerts = ref<Alert[]>([]);
const recentAlertsLoading = ref(false);

const fetchLocalhostDetail = async (ip_address: string) => {
  isLoading.value = true;
  localHostDetail.value = null;
  try {
    const { data } = await getLocalhostDetail(ip_address);
    localHostDetail.value = data;
  } catch (error) {
    console.error("Error fetching localhost details:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchAlertDetail = async (ip_address: string) => {
  isLoading.value = true;
  alertDetail.value = null;
  try {
    const { data } = await getHostAlertDetails(ip_address);
    alertDetail.value = data;
  } catch (error) {
    console.error("Error fetching localhost details:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchTrafficStats = async (ip_address: string) => {
  isLoading.value = true;
  trafficStats.value = null;
  try {
    const { data } = await getLocalhostTraffic(ip_address);
    trafficStats.value = data;
  } catch (error) {
    console.error("Error fetching localhost details:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchRecentHostAlerts = async (ip_address: string) => {
  recentAlertsLoading.value = true;
  recentHostAlerts.value = [];
  try {
    const { data } = await getHostRecentAlerts(ip_address);
    recentHostAlerts.value = data;
  } catch (error) {
    console.error("Error fetching localhost details:", error);
  } finally {
    recentAlertsLoading.value = false;
  }
};

const updateData = async (ip_address: string) => {
  isLoading.value = true;
  try {
    // Scroll to top when data updates
    window.scrollTo({ top: 0, behavior: "smooth" });

    await fetchLocalhostDetail(ip_address);
    await fetchAlertDetail(ip_address);
    await fetchTrafficStats(ip_address);
    await fetchRecentHostAlerts(ip_address);
  } catch (error) {
    console.error("Error updating data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in the route params to update the IP address
watch(
  () => route.params.ip_address as string,
  (newIpAddress: string) => {
    ip_address.value = newIpAddress;
    updateData(newIpAddress);
  }
);

onMounted(async () => {
  // Scroll to top when component mounts
  window.scrollTo({ top: 0, behavior: "smooth" });
  await updateData(ip_address.value);
});
</script>

<style scoped>
.host-details {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.custom-heading {
  text-transform: uppercase !important;
  font-size: 32px !important;
  font-weight: 500;
  color: #b1b8c0 !important;
  font-family: BlinkMacSystemFont, "segoe ui", Roboto, "helvetica neue", Arial,
    "noto sans", sans-serif, "apple color emoji", "segoe ui emoji",
    "segoe ui symbol", "noto color emoji";
}

.text-subtitle-1 {
  color: rgb(92, 221, 139) !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  margin-top: 3px;
}
</style>
