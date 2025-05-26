<template>
  <div>
    <v-row class="quickstats-background ma-0 rounded-lg">
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
          <div class="stat-description mb-1">{{ stat.description || "" }}</div>
          <div :class="['text-h5 text-sm-h4 text-md-h3', stat.color]">
            {{ stat.value }}
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <RecentAlerts
          :alerts="recentAlerts"
          :loading="alertsLoading"
          :show-refresh-button="true"
          @refresh="refreshAlerts"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getQuickStats } from "@/services/stats";
import RecentAlerts from "@/components/dashboard/RecentAlerts.vue";
import { useHostsStore } from "@/stores/hosts";

// Stats data from API
const quickStats = ref({
  acknowledged_alerts: 0,
  unacknowledged_alerts: 0,
  total_alerts: 0,
  unacknowledged_localhosts_count: 0,
  acknowledged_localhosts_count: 0,
  total_localhosts_count: 0,
  ignorelist_count: 0,
});

// Initialize hosts store for alerts data
const hosts = useHostsStore();
const alertsLoading = ref(false);

// Status stats computed from quickStats
const statusStats = computed(() => [
  {
    label: "Hosts",
    description: "Acknowledged",
    value: quickStats.value.acknowledged_localhosts_count || 0,
    color: "text-green-accent-3",
  },
  {
    label: "Hosts",
    description: "Unacknowledged",
    value: quickStats.value.unacknowledged_localhosts_count || 0,
    color: "text-red",
  },
  {
    label: "Alerts",
    description: "Acknowledged",
    value: quickStats.value.acknowledged_alerts || 0,
    color: "text-green-accent-3",
  },
  {
    label: "Alerts",
    description: "Unacknowledged",
    value: quickStats.value.unacknowledged_alerts || 0,
    color: "text-red",
  },

]);

// Computed property to get recent alerts, sort and limit them
const recentAlerts = computed(() => {
  return [...hosts.alertsRecent]
    .sort(
      (a, b) =>
        new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime()
    )
    .slice(0, 50);
});

// Function to refresh the alerts data
const refreshAlerts = async () => {
  alertsLoading.value = true;
  try {
    await hosts.fetchRecentAlerts();
  } catch (error) {
    console.error("Error refreshing alerts:", error);
  } finally {
    alertsLoading.value = false;
  }
};

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

// Initialize data on mount
onMounted(async () => {
  // Load initial data
  fetchStats();

  // If alerts haven't been loaded yet, load them
  if (!hosts.alertsRecent.length) {
    refreshAlerts();
  }
});
</script>

<style scoped>
.dashboard {
  background-color: transparent;
  height: 100%;
}

.text-red {
  color: #dc3545 !important;
  font-size: 30px;
  font-weight: 700;
  display: block;
  font-family: BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial,
    noto sans, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol,
    noto color emoji;
}

.text-md-h3 {
  font-size: 30px !important;
  font-weight: 700;
  display: block;
  font-family: BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial,
    noto sans, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol,
    noto color emoji;
}

.text-green-accent-3 {
  color: #5cdd8b !important;
  font-size: 30px;
  font-weight: 700;
  display: block;
  font-family: BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial,
    noto sans, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol,
    noto color emoji;
}

.text-subtitle-1 {
  font-size: 1.75rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 25px;
  text-size-adjust: 100%;
  font-size: 28px !important;
  font-weight: 500;
  display: block;
  color: rgb(177, 184, 192);
  font-family: BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial,
    noto sans, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol,
    noto color emoji;
}

.quickstats-background {
  background-color: #0d1117 !important;
  color: rgba(255, 255, 255, 0.87);
  padding: 5px;
}

.stat-description {
  font-size: 14px;
  color: #8b949e;
  font-weight: 400;
  line-height: 1.2;
  font-family: BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial,
    sans-serif;
}
</style>
