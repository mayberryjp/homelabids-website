<template>
  <div>
    <div>
      <div class="maintenance-actions">
        <div class="maintenance-action mb-6">
          <v-btn
            color="error"
            variant="elevated"
            min-width="260"
            elevation="2"
            prepend-icon="mdi-delete-alert"
            @click="confirmDeleteAllAlerts"
            :loading="isDeleteAlertsLoading"
          >
            Delete All Alerts
          </v-btn>
          <p class="text-body-2 mt-2">
            This will permanently delete all alert data from the system. This
            action cannot be undone.
          </p>
        </div>

        <div class="maintenance-action">
          <v-btn
            color="primary"
            variant="elevated"
            min-width="260"
            elevation="2"
            prepend-icon="mdi-reload"
            @click="confirmRecalculateThreatScores"
            :loading="isRecalculatingScores"
          >
            Recalculate Threat Scores
          </v-btn>
          <p class="text-body-2 mt-2">
            This will recalculate threat scores for all hosts in the system.
            This may take a few minutes to complete.
          </p>
        </div>
      </div>
    </div>

    <!-- Delete Alerts Confirmation Dialog -->
    <v-dialog v-model="deleteAlertsDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Delete All Alerts</v-card-title>
        <v-card-text>
          Are you sure you want to delete all alerts? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="deleteAlertsDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="text" @click="deleteAllAlerts">
            Delete All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Recalculate Threat Scores Confirmation Dialog -->
    <v-dialog v-model="recalculateScoresDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Recalculate Threat Scores</v-card-title>
        <v-card-text>
          Are you sure you want to recalculate threat scores for all hosts? This may take some time.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="recalculateScoresDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="text" @click="recalculateThreatScores">
            Recalculate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { deleteAllAlerts as deleteAllAlertsService, forceThreatCollection } from "@/services/alerts";
import { useNotificationStore } from "@/stores/notification";

// State management
const isDeleteAlertsLoading = ref(false);
const isRecalculatingScores = ref(false);
const deleteAlertsDialog = ref(false);
const recalculateScoresDialog = ref(false);
const notificationStore = useNotificationStore();

// Delete all alerts
const confirmDeleteAllAlerts = () => {
  deleteAlertsDialog.value = true;
};

const deleteAllAlerts = async () => {
  isDeleteAlertsLoading.value = true;
  try {
    await deleteAllAlertsService();
    notificationStore.showSuccess("All alerts have been successfully deleted");
  } catch (error) {
    console.error("Error deleting alerts:", error);
    notificationStore.showError("Failed to delete alerts. Please try again.");
  } finally {
    isDeleteAlertsLoading.value = false;
    deleteAlertsDialog.value = false;
  }
};

// Recalculate threat scores
const confirmRecalculateThreatScores = () => {
  recalculateScoresDialog.value = true;
};

const recalculateThreatScores = async () => {
  isRecalculatingScores.value = true;
  try {
    await forceThreatCollection();
    notificationStore.showSuccess("Threat score recalculation has been initiated");
  } catch (error) {
    console.error("Error recalculating threat scores:", error);
    notificationStore.showError("Failed to recalculate threat scores. Please try again.");
  } finally {
    isRecalculatingScores.value = false;
    recalculateScoresDialog.value = false;
  }
};
</script>

<style scoped>
.maintenance-actions {
  display: flex;
  flex-direction: column;
  max-width: 500px;
}

.maintenance-action {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
