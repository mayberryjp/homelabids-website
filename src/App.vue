<template>
  <router-view></router-view>
  
  <!-- Global notification snackbar -->
  <v-snackbar
    v-model="notificationStore.snackbar.show"
    :color="notificationStore.snackbar.color"
    :timeout="notificationStore.snackbar.timeout"
    :location="notificationStore.snackbar.location"
  >
    {{ notificationStore.snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotificationStore } from "@/stores/notification";

const notificationStore = useNotificationStore();
</script>