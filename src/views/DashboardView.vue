<template>
  <div>
    <v-row class="bg-background-100 ma-0 rounded-lg">
      <!-- Status Cards -->
      <v-col
        cols="12"
        sm="4"
        md="2"
        v-for="(stat, index) in statusStats"
        :key="index"
        class="bg-transparent"
      >
        <v-card
          variant="plain"
          class="text-center pa-4 bg-transparent border-none"
        >
          <div class="text-subtitle-1 mb-1">{{ stat.label }}</div>
          <div :class="['text-h5 text-sm-h4 text-md-h3', stat.color]">
            {{ stat.value }}
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <RecentAlerts />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getQuickStats } from "@/services/stats";
import RecentAlerts from "@/components/dashboard/RecentAlerts.vue";

// Stats data from API
const quickStats = ref({
  acknowledged_alerts: 0,
  unacknowledged_alerts: 0,
  total_alerts: 0,
  unacknowledged_localhosts_count: 0,
  acknowledged_localhosts_count: 0,
  total_localhosts_count: 0,
  whitelist_count: 0,
});

// Status stats computed from quickStats
const statusStats = computed(() => [
  {
    label: "Hosts Acked",
    value: quickStats.value.acknowledged_localhosts_count || 0,
    color: "text-green-accent-3",
  },
  {
    label: "Hosts Unacked",
    value: quickStats.value.unacknowledged_localhosts_count || 0,
    color: "text-red",
  },
  {
    label: "Alerts Acked",
    value: quickStats.value.acknowledged_alerts || 0,
    color: "text-green-accent-3",
  },
  {
    label: "Alerts Unacked",
    value: quickStats.value.unacknowledged_alerts || 0,
    color: "text-red",
  },
  {
    label: "Total Alerts",
    value: quickStats.value.total_alerts || 0,
    color: "text-grey",
  },
  {
    label: "Whitelist Count",
    value: quickStats.value.whitelist_count || 0,
    color: "text-grey",
  },
]);

// Fetch stats data from the API
const fetchStats = async () => {
  try {
    const response = await getQuickStats();
    console.log("Fetched stats:", response.data);
    quickStats.value = response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.dashboard {
  background-color: transparent;
  height: 100%;
}
</style>
