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
            <div class="host-title me-4">
              <h2 class="text-h4 text-grey custom-heading">
                {{ localHostDetail.local_description }}
              </h2>
              <div class="text-subtitle-1 text-green">
                IP Address: {{ ip_address }}
              </div>
            </div>

            <div class="mt-2">
              <AlertBars
                :ip-address="ip_address"
                :bar-count="24"
                :height="40"
                :width="12"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Content goes here -->
      <v-card color="#0d1117" v-if="trafficStats" class="pa-2">
        <v-card-title class="text-white"
          >Network Traffic Statistics</v-card-title
        >
        <v-card-subtitle class="text-grey"
          >Displaying total bytes and packets over time</v-card-subtitle
        >
        <HostAlertsChart :traffic-stats="trafficStats" />
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLocalhostDetail, getLocalhostTraffic } from "@/services/hosts";
import { useRoute } from "vue-router";
import { onMounted, watch, ref } from "vue";
import AlertBars from "@/components/base/AlertBars.vue";
import AppLoader from "@/components/base/AppLoader.vue";
import type { Localhost } from "@/types/localhosts";
import { getHostAlertDetails } from "@/services/alerts";
import HostAlertsChart from "@/components/host-details/HostAlertsChart.vue";

const route = useRoute();
const ip_address = ref(route.params.ip_address as string);
const localHostDetail = ref<Localhost | null>(null);
const alertDetail = ref(null);
const trafficStats = ref(null);
const isLoading = ref(true);

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

const updateData = async (ip_address: string) => {
  isLoading.value = true;
  try {
    await fetchLocalhostDetail(ip_address);
    await fetchAlertDetail(ip_address);
    await fetchTrafficStats(ip_address);
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
