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
      :items="ignoreListItems"
      :items-per-page="itemsPerPage"
      class="ignore-list-table"
      density="compact"
    >
      <!-- Allow List ID Column -->
      <template v-slot:item.id="{ item }">
        <span class="text-caption truncate-id" :title="item.id">{{ item.id }}</span>
      </template>

      <!-- Source IP Column -->
      <template v-slot:item.src_ip="{ item }">
        <span class="text-white">{{ item.src_ip }}</span>
      </template>

      <!-- Dest IP Column -->
      <template v-slot:item.dst_ip="{ item }">
        <span class="text-white">{{ item.dst_ip }}</span>
      </template>

      <!-- Dest Port Column -->
      <template v-slot:item.dst_port="{ item }">
        <span class="text-white">{{ item.dst_port }}</span>
      </template>

      <!-- Protocol Column -->
      <template v-slot:item.protocol="{ item }">
        <span class="text-white">{{ getProtocolName(item.protocol) }}</span>
      </template>

      <!-- First Seen Column -->
      <template v-slot:item.first_seen="{ item }">
        <span class="date-column">{{ formatMixedTimestamp(item.first_seen) }}</span>
      </template>
      
      <!-- Last Seen Column -->
      <template v-slot:item.last_seen="{ item }">
        <span class="date-column">{{ formatMixedTimestamp(item.last_seen) }}</span>
      </template>

      <!-- Times Seen Column -->
      <template v-slot:item.times_seen="{ item }">
        <span class="text-white">{{ item.times_seen }}</span>
      </template>

      <!-- Delete Column -->
      <template v-slot:item.delete="{ item }">
        <v-btn
          icon
          variant="text"
          size="small"
          color="error"
          @click="deleteIgnoreListItem(item)"
          :disabled="actionInProgress"
          title="Delete Allow List Item"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IgnoreListItem } from "@/types/alerts";
import { deleteIgnoreListItem as apiDeleteIgnoreListItem } from "@/services/hosts";
import { formatMixedTimestamp } from "@/utils/date";
import { getProtocolName } from "@/utils/protocol";
import { useNotificationStore } from "@/stores/notification";

// Define props for the component
const props = defineProps<{
  ignoreListItems: IgnoreListItem[];
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
const title = props.title || "Allow List";
const loading = props.loading || false;
const itemsPerPage = props.itemsPerPage || 50;
const actionInProgress = ref(false);

// Get notification store
const notificationStore = useNotificationStore();

// Table headers
const headers = [
  { title: "Allow List ID", key: "id", sortable: true },
  { title: "Source IP", key: "src_ip", sortable: true },
  { title: "Dest IP", key: "dst_ip", sortable: true },
  { title: "Dest Port", key: "dst_port", sortable: true },
  { title: "Protocol", key: "protocol", sortable: true },
  { title: "First Seen", key: "first_seen", sortable: true },
  { title: "Last Seen", key: "last_seen", sortable: true },
  { title: "Times Seen", key: "times_seen", sortable: true, width: "130px" },
  {
    title: "Delete",
    key: "delete",
    align: "center" as const,
    sortable: false,
    width: "50px",
  },
];

// Action handlers
const deleteIgnoreListItem = async (item: IgnoreListItem) => {
  if (actionInProgress.value) return;
  actionInProgress.value = true;

  try {
    await apiDeleteIgnoreListItem(item.id);

    notificationStore.showSuccess("Allow list item deleted successfully");

    // Refresh the data
    emit("refresh");
  } catch (error) {
    console.error("Error deleting allow list item:", error);
    notificationStore.showError("Failed to delete allow list item");
  } finally {
    actionInProgress.value = false;
  }
};
</script>

<style scoped>
:deep(.v-data-table) {
  background-color: transparent !important;
}

/* Style for table header */
:deep(.v-data-table .v-data-table-header) {
  background-color: #0d1117 !important;
}


/* Change the entire table background */
:deep(.v-table) {
  background-color: #0d1117 !important;
}

/* Ensure the inner wrapper also has the background color */
:deep(.v-table .v-table__wrapper) {
  background-color: #0d1117 !important;
}


.ignore-list-table {
  color: #b1b8c0;
}

.text-h6 {
  color: #b1b8c0;
  font-size: 32px !important;
}

.date-column {
  color: #b1b8c0;
  font-weight: 500;
  white-space: nowrap;
  display: inline-block;
  min-width: 90px; /* Ensures consistent width */
}

/* You can also add this to control the width of the date columns */
:deep(.v-table th:nth-child(6)),
:deep(.v-table th:nth-child(7)) {
  min-width: 100px;
  white-space: nowrap;
}

.truncate-id {
  max-width: 120px; /* Adjust this value if needed for ~20 characters */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
</style>
