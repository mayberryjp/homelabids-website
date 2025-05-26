<template>
  <div class="host-details">
    <!-- Host Header Section -->



    <v-card color="#0d1117" class="mb-4">
      <v-card-text v-if="localHostDetail">
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
    <HostActions
      :ip-address="ip_address"
      class="mb-4"
      :alerts_enabled="localHostDetail?.alerts_enabled"
    />
      </v-card-text>
      <v-card-text v-else>
        <AppSkeleton type="text@2" color="#0d1117" />
      </v-card-text>
    </v-card>

    <v-card color="#0d1117" class="mb-4">
      <AppSkeleton v-if="hostStatsLoading" type="article" color="#0d1117" />
      <HostStats v-else-if="localHostDetail" :host-detail="localHostDetail" />
    </v-card>

    <!-- Traffic Stats -->
    <v-card color="#0d1117" class="pa-2 mb-4">
      <AppSkeleton v-if="trafficStatsLoading" type="image" color="#0d1117" />
      <div v-else-if="trafficStats">
        <v-card-title class="text-white"
          >Network Traffic Statistics</v-card-title
        >
        <v-card-subtitle class="text-grey"
          >Displaying total bytes and packets over time</v-card-subtitle
        >
        <HostAlertsChart :traffic-stats="trafficStats" />
      </div>
      <v-card-text v-else class="text-center text-grey"
        >No traffic data available</v-card-text
      >
    </v-card>

    <!-- Host-specific Alerts -->
    <v-card color="#0d1117" class="mb-4">
      <AppSkeleton v-if="recentAlertsLoading" type="table" color="#0d1117" />
      <RecentAlerts
        v-else
        :alerts="recentHostAlerts"
        title="Host Alerts"
        :items-per-page="10"
        :showRefreshButton="true"
        :loading="recentAlertsLoading"
        @refresh="fetchRecentHostAlerts(ip_address)"
      />
      <v-card-text
        v-if="!recentAlertsLoading && !recentHostAlerts.length"
        class="text-center text-grey"
      >
        No alerts found for this host
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { getLocalhostDetail, getLocalhostTraffic } from "@/services/hosts";
import { useRoute } from "vue-router";
import { onMounted, watch, ref } from "vue";
import type { Localhost } from "@/types/localhosts";
import { getHostAlertDetails, getHostRecentAlerts } from "@/services/alerts";
import HostAlertsChart from "@/components/host-details/HostAlertsChart.vue";
import RecentAlerts from "@/components/dashboard/RecentAlerts.vue";
import type { Alert, AlertDetail } from "@/types/alerts";
import HostStats from "@/components/host-details/HostStats.vue";
import HostActions from "@/components/host-details/HostActions.vue";
import AlertBars from "@/components/base/AlertBars.vue";
import AppSkeleton from "@/components/base/AppSkeleton.vue";

const route = useRoute();
const ip_address = ref(route.params.ip_address as string);
const localHostDetail = ref<Localhost | null>(null);
const alertDetail = ref<AlertDetail | null>(null);
const trafficStats = ref(null);
const hostStatsLoading = ref(true);
const trafficStatsLoading = ref(true);
const recentHostAlerts = ref<Alert[]>([]);
const recentAlertsLoading = ref(true);

const fetchLocalhostDetail = async (ip_address: string) => {
  hostStatsLoading.value = true;
  localHostDetail.value = null;
  try {
    const { data } = await getLocalhostDetail(ip_address);
    localHostDetail.value = data;
  } catch (error) {
    console.error("Error fetching localhost details:", error);
  } finally {
    hostStatsLoading.value = false;
  }
};

const fetchAlertDetail = async (ip_address: string) => {
  alertDetail.value = null;
  try {
    const { data } = await getHostAlertDetails(ip_address);
    alertDetail.value = data;
  } catch (error) {
    console.error("Error fetching alert details:", error);
  }
};

const fetchTrafficStats = async (ip_address: string) => {
  trafficStatsLoading.value = true;
  trafficStats.value = null;
  try {
    const { data } = await getLocalhostTraffic(ip_address);
    trafficStats.value = data;
  } catch (error) {
    console.error("Error fetching traffic stats:", error);
  } finally {
    trafficStatsLoading.value = false;
  }
};

const fetchRecentHostAlerts = async (ip_address: string) => {
  recentAlertsLoading.value = true;
  recentHostAlerts.value = [];
  try {
    const { data } = await getHostRecentAlerts(ip_address);
    recentHostAlerts.value = data;
  } catch (error) {
    console.error("Error fetching host alerts:", error);
  } finally {
    recentAlertsLoading.value = false;
  }
};

const updateData = async (ip_address: string) => {
  try {
    // Scroll to top when data updates
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset loading states
    hostStatsLoading.value = true;
    trafficStatsLoading.value = true;
    recentAlertsLoading.value = true;

    // Start all fetches in parallel

    await fetchLocalhostDetail(ip_address);

    const promises = [
      fetchAlertDetail(ip_address),
      fetchTrafficStats(ip_address),
      fetchRecentHostAlerts(ip_address),
    ];

    // Let all promises complete in the background
    await Promise.all(promises);
  } catch (error) {
    console.error("Error updating data:", error);
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
