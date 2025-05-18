<template>
  <v-sheet rounded="lg" height="100%" color="#090c10">
    <v-card-title class="d-flex align-center px-4 py-3">
      <span class="text-h6">{{ title }}</span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="showRefreshButton"
        icon="mdi-refresh"
        variant="text"
        size="small"
        @click="$emit('refresh')"
        :loading="loading"
      ></v-btn>
    </v-card-title>
    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="alerts"
      :items-per-page="itemsPerPage"
      class="alerts-table"
      density="compact"
    >
      <!-- Category Column -->
      <template v-slot:item.category="{ item }">
        <span class="text-caption">{{ item.category }}</span>
      </template>

      <!-- IP Address Column -->
      <template v-slot:item.ip_address="{ item }">
        <div>
          <div v-if="item.local_description">
            {{ item.local_description }} ({{ item.ip_address }})
          </div>
          <div v-else>{{ item.ip_address }}</div>
        </div>
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
import { ref } from "vue";
import { formatDateTime } from "@/utils/date";
import type { Alert } from "@/types/alerts";

// Define props for the component
const props = defineProps<{
  alerts: Alert[];
  title?: string;
  loading?: boolean;
  showRefreshButton?: boolean;
  itemsPerPage?: number;
}>();

// Define emits for the component
const emit = defineEmits<{
  (e: "refresh"): void;
}>();

// Default values for props
const title = props.title || "Most Recent Detections";
const loading = props.loading || false;
const itemsPerPage = props.itemsPerPage || 50;

// Table headers
const headers = [
  { title: "Detection Category", key: "category", sortable: true },
  { title: "Local Host", key: "ip_address", sortable: true },
  { title: "Details", key: "alert_enrichment_1", sortable: true },
  { title: "Details", key: "alert_enrichment_2", sortable: true },
  {
    title: "Acknowledged",
    key: "acknowledged",
    align: "center" as const,
    sortable: true,
  },
  { title: "Last Seen", key: "last_seen", sortable: true },
];
</script>

<style scoped>
:deep(.v-data-table) {
  background-color: transparent !important;
}

.alerts-table {
  color: #b1b8c0;
}

.text-h6 {
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
