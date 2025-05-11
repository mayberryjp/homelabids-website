<template>
  <div>
    <v-row class="bg-background-100 ma-0">
      <!-- Status Cards -->
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-transparent"
      >
        <v-card
          variant="plain"
          class="text-center pa-4 bg-transparent border-none"
        >
          <div class="text-h6 mb-1">{{ stat.label }}</div>
          <div class="text-h3">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Stats data for the cards
const stats = ref([
  { label: "Up", value: "0", color: "success-lighten-1" },
  { label: "Down", value: "0", color: "error-lighten-1" },
  { label: "Maintenance", value: "0", color: "warning-lighten-1" },
  { label: "Unknown", value: "0", color: "info-lighten-1" },
]);
</script>

<style scoped>
.dashboard {
  background-color: transparent;
  height: 100%;
}
</style>
