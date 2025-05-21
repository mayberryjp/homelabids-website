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

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom"
    >
      {{ snackbar.text }}
    </v-snackbar>

    <v-data-table
      :headers="headers"
      :items="alerts"
      :items-per-page="itemsPerPage"
      class="alerts-table"
      density="compact"
    >
      <!-- Actions Column -->
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              size="small"
              v-bind="props"
              :disabled="actionInProgress"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item @click="acknowledgeAlert(item)">
              <v-list-item-title>Acknowledge Alert</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteAlert(item)">
              <v-list-item-title>Delete Alert</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="whitelistExactFlow(item)">
              <v-list-item-title>Allowlist Exact Flow</v-list-item-title>
            </v-list-item>
            <v-list-item @click="whitelistSourceToPort(item)">
              <v-list-item-title>Allowlist Source to Port Any Destination</v-list-item-title>
            </v-list-item>
            <v-list-item @click="whitelistSourceToDestination(item)">
              <v-list-item-title
                >Allowlist Source to Destination Any Port</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

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
import {
  acknowledgeAlert as apiAcknowledgeAlert,
  deleteAlert as apiDeleteAlert,
  addToWhitelist,
  type WhitelistPayload,
} from "@/services/alerts";

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
const actionInProgress = ref(false);

// Snackbar for action feedback
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

// Parse flow information
const parseFlow = (
  flowString: string
): {
  src_ip: string;
  dst_ip: string;
  src_port: string | number;
  dst_port: string | number;
  protocol: string | number;
} => {
  try {
    // Format: [src_ip, dst_ip, src_port, dst_port, protocol, ...]
    // Example: "[\"192.168.60.4\", \"168.63.129.16\", 52462, 53, 17, ...]"
    const flowArray = JSON.parse(flowString);

    return {
      src_ip: flowArray[0] || "",
      dst_ip: flowArray[1] || "",
      src_port: flowArray[2] || "",
      dst_port: flowArray[3] || "",
      protocol: flowArray[4] || "",
    };
  } catch (error) {
    console.error("Error parsing flow data:", error, flowString);
    return {
      src_ip: "",
      dst_ip: "",
      src_port: "",
      dst_port: "",
      protocol: "",
    };
  }
};

// Action handlers
const acknowledgeAlert = async (alert: Alert) => {
  if (actionInProgress.value) return;
  actionInProgress.value = true;

  try {
    await apiAcknowledgeAlert(alert.id);

    // Update the alert in the local list
    alert.acknowledged = true;

    snackbar.value = {
      show: true,
      text: "Alert acknowledged successfully",
      color: "success",
    };

    // Refresh the data
    emit("refresh");
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    snackbar.value = {
      show: true,
      text: "Failed to acknowledge alert",
      color: "error",
    };
  } finally {
    actionInProgress.value = false;
  }
};

const deleteAlert = async (alert: Alert) => {
  if (actionInProgress.value) return;
  actionInProgress.value = true;

  try {
    await apiDeleteAlert(alert.id);

    snackbar.value = {
      show: true,
      text: "Alert deleted successfully",
      color: "success",
    };

    // Refresh the data
    emit("refresh");
  } catch (error) {
    console.error("Error deleting alert:", error);
    snackbar.value = {
      show: true,
      text: "Failed to delete alert",
      color: "error",
    };
  } finally {
    actionInProgress.value = false;
  }
};

const whitelistExactFlow = async (alert: Alert) => {
  if (actionInProgress.value) return;
  actionInProgress.value = true;

  try {
    const flowData = parseFlow(alert.flow);

    const payload: WhitelistPayload = {
      ignorelist_id: `IgnoreList_${alert.id}_Flow`,
      src_ip: alert.ip_address,
      dst_ip: flowData.dst_ip,
      dst_port: flowData.dst_port,
      protocol: flowData.protocol,
    };

    await addToWhitelist(payload);

    snackbar.value = {
      show: true,
      text: "Exact flow added to allowlist",
      color: "success",
    };

    // Refresh the data
    emit("refresh");
  } catch (error) {
    console.error("Error adding to whitelist:", error);
    snackbar.value = {
      show: true,
      text: "Failed to add to allowlist",
      color: "error",
    };
  } finally {
    actionInProgress.value = false;
  }
};

const whitelistSourceToPort = async (alert: Alert) => {
  if (actionInProgress.value) return;
  actionInProgress.value = true;

  try {
    const flowData = parseFlow(alert.flow);

    const payload: WhitelistPayload = {
      ignorelist_id: `IgnoreList_${alert.id}_Port`,
      src_ip: alert.ip_address,
      dst_ip: "*",
      dst_port: flowData.dst_port,
      protocol: flowData.protocol,
    };

    await addToWhitelist(payload);

    snackbar.value = {
      show: true,
      text: "Source to port added to allowlist",
      color: "success",
    };

    // Refresh the data
    emit("refresh");
  } catch (error) {
    console.error("Error adding to ignorelist:", error);
    snackbar.value = {
      show: true,
      text: "Failed to add to allowlist",
      color: "error",
    };
  } finally {
    actionInProgress.value = false;
  }
};

const whitelistSourceToDestination = async (alert: Alert) => {
  if (actionInProgress.value) return;
  actionInProgress.value = true;

  try {
    const flowData = parseFlow(alert.flow);

    const payload: WhitelistPayload = {
      ignorelist_id: `IgnoreList_${alert.id}_Destination`,
      src_ip: alert.ip_address,
      dst_ip: flowData.dst_ip,
      dst_port: "*",
      protocol: flowData.protocol,
    };

    await addToWhitelist(payload);

    snackbar.value = {
      show: true,
      text: "Source to destination added to allowlist",
      color: "success",
    };

    // Refresh the data
    emit("refresh");
  } catch (error) {
    console.error("Error adding to whitelist:", error);
    snackbar.value = {
      show: true,
      text: "Failed to add to allowlist",
      color: "error",
    };
  } finally {
    actionInProgress.value = false;
  }
};

// Table headers
const headers = [
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    align: "start" as const,
  },
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
