<template>
  <v-sheet rounded="lg" height="100%" color="background-100">
    <v-card-title class="d-flex align-center px-4 py-3">
      <span class="text-h6">Recent Alerts</span>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-refresh"
        variant="text"
        size="small"
        @click="refreshAlerts"
        :loading="loading"
      ></v-btn>
    </v-card-title>
    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="recentAlerts"
      :items-per-page="10"
      class="alerts-table"
      density="compact"
    >
      <!-- Category Column -->
      <template v-slot:item.category="{ item }">
        <span class="text-caption">{{ item.category }}</span>
      </template>

      <!-- IP Address Column -->
      <template v-slot:item.ip_address="{ item }">
        {{ item.ip_address }}
      </template>

      <!-- Acknowledged Column -->
      <template v-slot:item.acknowledged="{ item }">
        <v-chip
          size="small"
          :color="item.acknowledged ? 'green' : 'red'"
          text-color="white"
        >
          {{ item.acknowledged ? "1" : "0" }}
        </v-chip>
      </template>

      <!-- Last Seen Column -->
      <template v-slot:item.last_seen="{ item }">
        {{ formatDateTime(item.last_seen) }}
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup lang="ts">
import { useHostsStore } from "@/stores/hosts";
import { computed, ref } from "vue";
import { formatDateTime } from "@/utils/date";

const hosts = useHostsStore();
const loading = ref(false);

// Table headers
const headers = [
  { title: "Category", key: "category", sortable: true },
  { title: "IP Address", key: "ip_address", sortable: true },
  {
    title: "Acknowledged",
    key: "acknowledged",
    align: "center" as const,
    sortable: true,
  },
  { title: "Last Seen", key: "last_seen", sortable: true },
];

// Get the most recent 25 alerts, sorted by last_seen timestamp
const recentAlerts = computed(() => {
  return [...hosts.alertsRecent]
    .sort(
      (a, b) =>
        new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime()
    )
    .slice(0, 25);
});

// Function to refresh the alerts data
const refreshAlerts = async () => {
  loading.value = true;
  try {
    await hosts.fetchRecentAlerts();
  } catch (error) {
    console.error("Error refreshing alerts:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.v-data-table) {
  background-color: transparent !important;
}
</style>
