<template>
  <div>
    <v-row class="bg-background-100 ma-0">
      <!-- Status Cards -->
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(stat, index) in statusStats"
        :key="index"
        class="bg-transparent"
      >
        <v-card
          variant="plain"
          class="text-center pa-4 bg-transparent border-none"
        >
          <div class="text-h6 mb-1">{{ stat.label }}</div>
          <div :class="['text-h3', stat.color]">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getQuickStats } from "@/services/stats";

// Stats data from API
const quickStats = ref({
  acknowledged_alerts: 0,
  unacknowledged_alerts: 0,
  total_alerts: 0,
  unacknowledged_localhosts_count: 0,
  acknowledged_localhosts_count: 0,
  total_localhosts_count: 0,
  whitelist_count: 0
});

// Status stats computed from quickStats
const statusStats = computed(() => [
  { 
    label: 'Up', 
    value: quickStats.value.acknowledged_localhosts_count || 0, 
    color: 'text-green-accent-3' 
  },
  { 
    label: 'Down', 
    value: quickStats.value.unacknowledged_alerts || 0, 
    color: 'text-red' 
  },
  { 
    label: 'Maintenance', 
    value: quickStats.value.whitelist_count || 0, 
    color: 'text-blue' 
  },
  { 
    label: 'Unknown', 
    value: quickStats.value.unacknowledged_localhosts_count || 0, 
    color: 'text-white' 
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
