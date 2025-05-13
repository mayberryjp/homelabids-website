<template>
  <v-sheet rounded="lg" height="100%" color="background-100">
    <v-list>
      <v-list-item
        v-for="host in hosts.localhosts"
        :key="host.ip_address"
        class="host-list-item"
      >
        <div class="d-flex align-center w-100">
          <div
            class="status-indicator"
            :class="host.acknowledged ? 'acknowledged' : 'unacknowledged'"
          >
            {{ host.acknowledged ? "100%" : "99.44%" }}
          </div>
          <div class="host-info ml-2">
            {{
              host.local_description || host.dhcp_hostname || host.ip_address
            }}
          </div>
          <div class="alert-bars ml-auto">
            <div
              v-for="i in 12"
              :key="i"
              class="alert-bar"
              :class="getAlertClass(host.ip_address, i)"
            ></div>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<script setup lang="ts">
import { useHostsStore } from "@/stores/hosts";
import { getAlertSeverity } from "@/types/alerts";
import type { AlertSeverity } from "@/types/alerts";
import { computed } from 'vue';

const hosts = useHostsStore();

// Create a map of IP addresses to alert items for O(1) lookups
const alertsMap = computed(() => {
  if (!hosts.alertsSummary) return new Map();
  
  return new Map(
    hosts.alertsSummary.map(alert => [alert.ip, alert])
  );
});


const getAlertClass = (ipAddress: string, hourIndex: number): AlertSeverity => {
  const alertItem = alertsMap.value.get(ipAddress);
  if (!alertItem) return 'alert-none';
  
  const alertCount = alertItem.alert_interval[hourIndex - 1] || 0;
  return getAlertSeverity(alertCount);
};
</script>

<style scoped>
.v-list {
  background-color: transparent;
}

.host-list-item {
  margin-bottom: 8px;
  padding: 8px 16px;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 24px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.acknowledged {
  background-color: #4caf50;
}

.unacknowledged {
  background-color: #f44336;
}

.host-info {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-bars {
  display: flex;
  gap: 2px;
}

.alert-bar {
  width: 5px;
  height: 20px;
  border-radius: 1px;
}

.alert-none {
  background-color: #4caf50;
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
