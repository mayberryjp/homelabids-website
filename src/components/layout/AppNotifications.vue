<template>
  <v-menu
    location="bottom"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        v-bind="props"
        class="mx-2"
        @click="refreshActions"
      >
        <v-badge
          :content="unacknowledgedCount"
          :value="unacknowledgedCount"
          color="error"
        >
          <v-icon icon="mdi-bell"></v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-card min-width="300">
      <v-card-title class="d-flex align-center">
        Notifications
        <v-spacer></v-spacer>
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
        <v-list v-if="actions.length > 0">
          <v-list-item
            v-for="action in actions"
            :key="action.id"
            :class="{ 'unacknowledged': action.acknowledged === 1 }"
          >
            <template v-slot:prepend>
              <v-icon 
                :color="action.acknowledged === 1 ? 'error' : ''"
                :icon="action.acknowledged === 1 ? 'mdi-alert-circle' : 'mdi-check-circle'"
              ></v-icon>
            </template>

            <v-list-item-title>{{ action.text }}</v-list-item-title>
            
            <template v-slot:append>
              <v-btn
                v-if="action.acknowledged === 1"
                variant="text"
                size="small"
                color="primary"
                @click="acknowledgeAlert(action)"
                :loading="acknowledging === action.id"
              >
                Acknowledge
              </v-btn>
            </template>
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
import { getActions, acknowledgeAction } from "@/services/actions";
import type { Action } from "@/types/actions";

// Notifications data
const actions = ref<Action[]>([]);
const loading = ref(false);
const acknowledging = ref<string | number | null>(null);

// Get unacknowledged count
const unacknowledgedCount = computed(() => {
  return actions.value.filter(action => action.acknowledged === 1).length;
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
  acknowledging.value = action.id;
  try {
    await acknowledgeAction(action.id);
    // Update the local list
    action.acknowledged = 0;
  } catch (error) {
    console.error("Failed to acknowledge action:", error);
  } finally {
    acknowledging.value = null;
  }
};

// Initial fetch on component mount
onMounted(() => {
  refreshActions();
});
</script>
