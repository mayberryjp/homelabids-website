<template>
  <div class="host-actions">
    <v-btn-group variant="outlined" class="rounded-pill">
      <v-btn
        :color="alertsEnabled ? 'success' : 'error'"
        @click="toggleAlerts"
        :loading="isTogglingAlerts"
        density="comfortable"
        class="text-body-2"
      >
        <v-icon :icon="alertsEnabled ? 'mdi-bell' : 'mdi-bell-off'" class="mr-2"></v-icon>
        {{ alertsEnabled ? "Alerts Enabled" : "Alerts Disabled" }}
      </v-btn>
      <v-btn
        color="grey"
        @click="openEditDialog"
        density="comfortable"
        class="text-body-2"
      >
        <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
        Edit
      </v-btn>
      <v-btn
        color="error"
        @click="openDeleteDialog"
        density="comfortable"
        class="text-body-2"
      >
        <v-icon icon="mdi-delete" class="mr-2"></v-icon>
        Delete
      </v-btn>
    </v-btn-group>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card class="pa-2">
        <v-card-title>Delete Host</v-card-title>
        <v-card-text>
          Are you sure you want to delete the host with IP address:
          {{ ipAddress }}? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="#a0364d"
            text
            @click="confirmDelete"
            :loading="isDeleting"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { deleteHost } from "@/services/hosts";
import { useHostsStore } from "@/stores/hosts";
import { updateAlertsEnabled } from "@/services/alerts";


const props = defineProps({
  ipAddress: {
    type: String,
    required: true,
  },
  alerts_enabled: {
    type: Number,
    required: false,
    default: 0,
  },
});

const router = useRouter();
const hostsStore = useHostsStore();
const deleteDialog = ref(false);
const isDeleting = ref(false);
const isTogglingAlerts = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const alertsEnabled = computed(() => props.alerts_enabled === 1);

const openEditDialog = () => {
  console.log("Edit host:", props.ipAddress);
};

const openDeleteDialog = () => {
  deleteDialog.value = true;
};

const toggleAlerts = async () => {
  isTogglingAlerts.value = true;
  try {
    const newAlertsState = !alertsEnabled.value;
    
    await updateAlertsEnabled(props.ipAddress, newAlertsState);
    
    await hostsStore.fetchLocalhosts();
    
    snackbar.value = {
      show: true,
      text: `Alerts ${newAlertsState ? 'enabled' : 'disabled'} for ${props.ipAddress}`,
      color: "success",
    };
  } catch (error) {
    console.error("Error toggling alerts:", error);
    snackbar.value = {
      show: true,
      text: "Failed to update alerts setting",
      color: "error",
    };
  } finally {
    isTogglingAlerts.value = false;
  }
};

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    await deleteHost(props.ipAddress);
    deleteDialog.value = false;
    await hostsStore.fetchLocalhosts();
    snackbar.value = {
      show: true,
      text: `Host ${props.ipAddress} deleted successfully`,
      color: "success",
    };
    router.push({ name: "dashboard" });
  } catch (error) {
    console.error("Error deleting host:", error);
    snackbar.value = {
      show: true,
      text: "Failed to delete host",
      color: "error",
    };
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.host-actions {
  display: flex;
  align-items: center;
}

.v-btn-group {
  background-color: #0d1117;
  border: 1px solid #0d1117 !important;
}

.v-btn {
  text-transform: none;
  font-weight: 400;
}
</style>
