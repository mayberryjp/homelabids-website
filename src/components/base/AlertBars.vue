<template>
  <div class="alert-bars">
    <div
      v-for="i in barCount"
      :key="i"
      class="alert-bar"
      :class="getAlertClass(ipAddress, i)"
      :style="{
        width: `${width}px`,
        height: `${height}px`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useHostsStore } from "@/stores/hosts";
import { getAlertSeverity } from "@/types/alerts";
import type { AlertSeverity } from "@/types/alerts";
import { computed } from "vue";

const props = defineProps({
  ipAddress: {
    type: String,
    required: true,
  },
  barCount: {
    type: Number,
    default: 12,
  },
  height: {
    type: Number,
    default: 16,
  },
  width: {
    type: Number,
    default: 5,
  },
});

const hosts = useHostsStore();

// Create a map of IP addresses to alert items for O(1) lookups
const alertsMap = computed(() => {
  if (!hosts.alertsSummary || !Array.isArray(hosts.alertsSummary))
    return new Map();

  return new Map(hosts.alertsSummary?.map((alert) => [alert.ip, alert]));
});

const getAlertClass = (ipAddress: string, hourIndex: number): AlertSeverity => {
  const alertItem = alertsMap.value.get(ipAddress);
  if (!alertItem) return "alert-none";

  const alertCount = alertItem.alert_interval[hourIndex - 1] || 0;
  return getAlertSeverity(alertCount);
};
</script>

<style scoped>
.alert-bars {
  display: flex;
  gap: 2px;
}

.alert-bar {
  margin: 1px;
  border-radius: 50rem;
  display: inline-block;
  box-sizing: border-box;
  --hover-scale: 1.5;
}

.alert-none {
  background-color: #5cdd8b;
}

.alert-low {
  background-color: #ffeb3b;
}

.alert-medium {
  background-color: #ff9800;
}

.alert-high {
  background-color: #f44336;
}

.alert-critical {
  background-color: #b71c1c;
}
</style>
