<template>
  <v-menu location="bottom" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" class="mx-2" @click="refreshActions">
        <v-badge
          :content="unacknowledgedCount"
          :value="unacknowledgedCount"
          color="#a0364d"
        >
          <v-icon icon="mdi-bell"></v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-card :width="$vuetify.display.xs ? '300px' : '400px'">
      <v-card-title class="d-flex align-center">
        Notifications
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          size="small"
          class="mr-2"
          @click="acknowledgeAllAlerts"
          :loading="acknowledgingAll"
          :disabled="!unacknowledgedCount || loading"
        >
          Acknowledge All
        </v-btn>
        <v-btn
          icon="mdi-refresh"
          variant="text"
          size="small"
          @click="refreshActions"
          :loading="loading"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <v-list v-if="sortedActions.length > 0">
          <v-list-item
            v-for="action in sortedActions"
            :key="action.action_id"
            class="notification-item"
          >
            <template v-slot:prepend>
              <v-icon
                :color="action.acknowledged === 0 ? 'error' : 'success'"
                icon="mdi-check-circle"
                @click.stop="acknowledgeAlert(action)"
                class="cursor-pointer"
                :loading="acknowledging === action.action_id"
              ></v-icon>
            </template>

            <v-list-item-title class="full-text">{{ action.action_text }}</v-list-item-title>
            
            <v-list-item-subtitle class="text-caption">
              {{ action.insert_date }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div v-else class="pa-4 text-center">
          <p>No notifications</p>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getActions, acknowledgeAction, acknowledgeAllActions } from "@/services/actions";
import type { Action } from "@/types/actions";

// Notifications data
const actions = ref<Action[]>([]);
const loading = ref(false);
const acknowledging = ref<number | null>(null);
const acknowledgingAll = ref(false);

// Get unacknowledged count
const unacknowledgedCount = computed(() => {
  return actions.value.filter((action) => action.acknowledged === 0).length;
});

// Sort actions with most recent first
const sortedActions = computed(() => {
  return [...actions.value].sort((a, b) => {
    // Sort by date descending (newest first)
    return new Date(b.insert_date).getTime() - new Date(a.insert_date).getTime();
  });
});

// Fetch actions from API
const refreshActions = async () => {
  loading.value = true;
  try {
    const data = await getActions();
    actions.value = data;
  } catch (error) {
    console.error("Failed to fetch actions:", error);
  } finally {
    loading.value = false;
  }
};

// Acknowledge an alert
const acknowledgeAlert = async (action: Action) => {
  // If already acknowledged, don't do anything
  if (action.acknowledged === 1) return;
  
  acknowledging.value = action.action_id;
  try {
    await acknowledgeAction(action.action_id);
    // Update the local list immediately without refresh
    action.acknowledged = 1;
  } catch (error) {
    console.error("Failed to acknowledge action:", error);
  } finally {
    acknowledging.value = null;
  }
};

// Acknowledge all alerts
const acknowledgeAllAlerts = async () => {
  if (!unacknowledgedCount.value) return;
  
  acknowledgingAll.value = true;
  try {
    // Call the API endpoint to acknowledge all notifications
    await acknowledgeAllActions();

    // Update local state of all unacknowledged notifications
    actions.value.forEach(action => {
      if (action.acknowledged === 0) {
        action.acknowledged = 1;
      }
    });
  } catch (error) {
    console.error("Failed to acknowledge all actions:", error);
  } finally {
    acknowledgingAll.value = false;
  }
};

// Initial fetch on component mount
onMounted(() => {
  refreshActions();
});
</script>

<style scoped>
/* Remove or comment out the unacknowledged class background styling */
/*
.unacknowledged {
  background-color: #a0364d !important;
  opacity: 1 !important;
}
*/

/* Add a subtle indicator if you still want some visual difference */
.notification-item {
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

/* This will add just a small border indicator instead of full background */
.v-icon.error {
  filter: drop-shadow(0 0 2px rgba(244, 67, 54, 0.5));
}

.full-text {
  white-space: normal;
  overflow: visible;
  line-height: 1.4;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
