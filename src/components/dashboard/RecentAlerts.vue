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
      show-expand
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
            <v-list-item @click="whitelistExactFlow(item)">
              <v-list-item-title>Allowlist Exact Flow</v-list-item-title>
            </v-list-item>
            <v-list-item @click="whitelistSourceToPort(item)">
              <v-list-item-title
                >Allowlist Source to Port Any Destination</v-list-item-title
              >
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

      <!-- Times Seen Column -->
      <template v-slot:item.times_seen="{ item }">
        {{ item.times_seen }}
      </template>

      <!-- Acknowledged Column -->
      <template v-slot:item.acknowledged="{ item }">
        <v-chip
          size="small"
          :color="item.acknowledged ? 'green' : 'red'"
          text-color="white"
          @click="acknowledgeAlert(item)"
          :disabled="actionInProgress"
          :loading="actionInProgress && processingItemId === item.id"
          class="text-caption cursor-pointer"
        >
          {{ item.acknowledged ? "Acknowledged" : "Unacknowledged" }}
        </v-chip>
      </template>

      <!-- Last Seen Column -->
      <template v-slot:item.last_seen="{ item }">
        {{ formatDateTime(item.last_seen) }}
      </template>

      <!-- Delete Column -->
      <template v-slot:item.delete="{ item }">
        <v-btn
          icon
          variant="text"
          size="small"
          color="error"
          @click="deleteAlert(item)"
          :disabled="actionInProgress"
          title="Delete Alert"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>

      <!-- Expanded Row for Flow Details -->
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="flow-details-row">
            <div class="flow-details-container pa-4">
              <!-- <v-divider color="blue-lighten-4" class="mb-3"></v-divider> -->

              <div v-if="item.flow" class="flow-details-text selectable">
                <div class="d-flex flex-wrap flow-row">
                  <div class="d-flex align-center flow-field mr-4">
                    <h4 class="text-subtitle-2 text-blue-lighten-3 mr-2">
                      Flow Details
                    </h4>
                    <v-btn
                      icon="mdi-content-copy"
                      density="compact"
                      variant="text"
                      size="small"
                      color="blue-lighten-3"
                      @click="copyFlowDetails(item)"
                      title="Copy Flow Details"
                    ></v-btn>
                  </div>

                  <div class="flow-field mr-4">
                    <span class="font-weight-medium text-blue-lighten-4 mr-1"
                      >Source IP:</span
                    >
                    <span class="text-white">{{
                      parseFlow(item.flow).src_ip || "N/A"
                    }}</span>
                  </div>

                  <div class="flow-field mr-4">
                    <span class="font-weight-medium text-blue-lighten-4 mr-1"
                      >Destination IP:</span
                    >
                    <span class="text-white">{{
                      parseFlow(item.flow).dst_ip || "N/A"
                    }}</span>
                  </div>

                  <div class="flow-field mr-4">
                    <span class="font-weight-medium text-blue-lighten-4 mr-1"
                      >Source Port:</span
                    >
                    <span class="text-white">{{
                      parseFlow(item.flow).src_port || "N/A"
                    }}</span>
                  </div>

                  <div class="flow-field mr-4">
                    <span class="font-weight-medium text-blue-lighten-4 mr-1"
                      >Destination Port:</span
                    >
                    <span class="text-white">{{
                      parseFlow(item.flow).dst_port || "N/A"
                    }}</span>
                  </div>

                  <div class="flow-field">
                    <span class="font-weight-medium text-blue-lighten-4 mr-1"
                      >Protocol:</span
                    >
                    <span class="text-white">{{
                      getProtocolName(parseFlow(item.flow).protocol) || "N/A"
                    }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-caption text-grey">
                No flow data available
              </div>
            </div>
          </td>
        </tr>
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
import { protocols } from "@/constants/AppConstants";

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
const processingItemId = ref<string | null>(null);

// Snackbar for action feedback
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

// Parse flow information
const parseFlow = (
  flowString: string | string[]
): {
  src_ip: string;
  dst_ip: string;
  src_port: string | number;
  dst_port: string | number;
  protocol: string;
} => {
  try {
    // Format: [src_ip, dst_ip, src_port, dst_port, protocol, ...]
    // Example: "[\"192.168.60.4\", \"168.63.129.16\", 52462, 53, 17, ...]"

    // some-times the data is in array format, some-times in string format

    const flowArray = Array.isArray(flowString)
      ? flowString
      : JSON.parse(flowString);

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

// Function to copy flow details to clipboard
const copyFlowDetails = (alert: Alert) => {
  if (!alert.flow) return;

  const flow = parseFlow(alert.flow);
  const protocol = getProtocolName(flow.protocol);

  const text = `Source IP: ${flow.src_ip}
Destination IP: ${flow.dst_ip}
Source Port: ${flow.src_port}
Destination Port: ${flow.dst_port}
Protocol: ${protocol}`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      snackbar.value = {
        show: true,
        text: "Flow details copied to clipboard",
        color: "success",
      };
    })
    .catch((err) => {
      console.error("Failed to copy flow details: ", err);
      snackbar.value = {
        show: true,
        text: "Failed to copy flow details",
        color: "error",
      };
    });
};

const getProtocolName = (protocol: string | number): string => {
  if (!protocol) return "Unknown";

  const protocolNum = Number(protocol);

  return protocols[protocolNum] || `Protocol ${protocol}`;
};

// Action handlers
const acknowledgeAlert = async (alert: Alert) => {
  if (actionInProgress.value) return;
  actionInProgress.value = true;
  processingItemId.value = alert.id;

  try {
    // Toggle the acknowledged state
    const currentState = alert.acknowledged;
    await apiAcknowledgeAlert(alert.id, !currentState);

    // Update the alert in the local list
    alert.acknowledged = !currentState;

    snackbar.value = {
      show: true,
      text: alert.acknowledged
        ? "Alert acknowledged successfully"
        : "Alert unacknowledged successfully",
      color: "success",
    };

    // Refresh the data
    emit("refresh");
  } catch (error) {
    console.error("Error toggling alert acknowledgement:", error);
    snackbar.value = {
      show: true,
      text: "Failed to update alert acknowledgement",
      color: "error",
    };
  } finally {
    actionInProgress.value = false;
    processingItemId.value = null;
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
  { title: "Times Seen", key: "times_seen", sortable: true, width: "130px" },
  {
    title: "Acknowledged",
    key: "acknowledged",
    align: "center" as const,
    sortable: true,
    width: "180px",
  },
  { title: "Last Seen", key: "last_seen", sortable: true },
  {
    title: "",
    key: "delete",
    align: "center" as const,
    sortable: false,
    width: "50px",
  },
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
  background-color: #0d1117 !important;
}

/* Ensure the inner wrapper also has the background color */
:deep(.v-table .v-table__wrapper) {
  background-color: #0d1117 !important;
}

/* Style for table header */
:deep(.v-data-table .v-data-table-header) {
  background-color: #0d1117 !important;
}

.alerts-table {
  color: #b1b8c0;
}

.text-h6 {
  color: #b1b8c0;
  font-size: 32px !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Flow tooltip styling */
:deep(.flow-tooltip-container) {
  opacity: 1 !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.flow-tooltip {
  max-width: 300px;
  border: 1px solid rgba(97, 163, 254, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
}

.flow-label {
  min-width: 120px;
}

.flow-item {
  border-bottom: 1px dashed rgba(97, 163, 254, 0.15);
}

.flow-item:last-child {
  border-bottom: none;
}

.flow-details-container {
  border-radius: 8px;
  border: 1px solid rgba(97, 163, 254, 0.3);
  background-color: #1e2736;
}

.flow-field {
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
}

.selectable {
  user-select: all;
}

.flow-row {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
