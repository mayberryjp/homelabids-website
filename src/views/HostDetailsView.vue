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
              <h2 class="text-h4">
                {{ localHostDetail.local_description }}
              </h2>
              <div class="text-subtitle-1 text-grey">{{ ip_address }}</div>
            </div>

            <div class="mt-2">
              <AlertBars :ip-address="ip_address" :bar-count="24" :height="40" :width="12" />
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Content goes here -->
      <v-card color="#0d1117">
        <v-card-text>
          <pre>{{ JSON.stringify(localHostDetail, null, 2) }}</pre>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLocalhostDetail } from "@/services/hosts";
import { useRoute } from "vue-router";
import { onMounted, watch, ref } from "vue";
import AlertBars from "@/components/base/AlertBars.vue";
import AppLoader from "@/components/base/AppLoader.vue";
import type { Localhost } from "@/types/localhosts";

const route = useRoute();
const ip_address = ref(route.params.ip_address as string);
const localHostDetail = ref<Localhost | null>(null);
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

// Watch for changes in the route params to update the IP address
watch(
  () => route.params.ip_address as string,
  (newIpAddress: string) => {
    ip_address.value = newIpAddress;
    fetchLocalhostDetail(newIpAddress);
  }
);

onMounted(async () => {
  fetchLocalhostDetail(ip_address.value);
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
</style>
