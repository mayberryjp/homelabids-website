<template>
  <v-sheet rounded="lg" height="100%" color="#090c10">
    <v-card-title class="d-flex align-center px-4 py-3">
      <span class="text-h6">Recent Detections</span>
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
      :items-per-page="50"
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
          {{ item.acknowledged ? "Yes" : "No" }}
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
  { title: "Local IP Address", key: "ip_address", sortable: true },
  { title: "Info 1", key: "enrichment_1", sortable: true },
  { title: "Info 2", key: "enrichment_2", sortable: true },
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
    .slice(0, 50);
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

.alerts-table {
  color: #b1b8c0;
}

.text-h6{
  color: #b1b8c0;
}


:deep(.v-data-table) {
  background-color: transparent !important;
}

/* Change the entire table background */
:deep(.v-table) {
  background-color: #0d1117 !important; /* Replace with your desired color */
}

/* Ensure the inner wrapper also has the background color */
:deep(.v-table .v-table__wrapper) {
  background-color: #0d1117 !important; /* Use the same color */
}

/* Style for table header */
:deep(.v-data-table .v-data-table-header) {
  background-color: #0d1117 !important; /* Use the same or slightly different color */
}

.alerts-table {
  color: #b1b8c0;
}

.text-h6 {
  color: #b1b8c0;
  font-size: 32px !important;
}
</style>
