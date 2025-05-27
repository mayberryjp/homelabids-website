<template>
  <v-sheet rounded="lg" height="100%" color="#0d1117" class="host-list custom-scrollbar">
    <v-list>
      <v-list-item
        v-for="host in sortedHosts"
        :key="host.ip_address"
        class="host-list-item"
        :class="{ 'selected-host': isHostSelected(host.ip_address) }"
        @click="hostClickHandler(host)"
      >
        <div class="d-flex align-center w-100">
          <div
            class="status-indicator"
            :style="{ backgroundColor: getThreatScoreColor(host.threat_score) }"
            :class="host.acknowledged ? 'acknowledged-border' : 'unacknowledged-border'"
          >
            {{ host.threat_score }}
          </div>
          <div class="host-info ml-2">
            {{
              host.local_description || host.ip_address
            }}
          </div>
          <AlertBars :alert-intervals="getAlertIntervals(host.ip_address)" class="ml-auto" />
        </div>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<script setup lang="ts">
import { useHostsStore } from "@/stores/hosts";
import { useRouter } from 'vue-router';
import AlertBars from "@/components/base/AlertBars.vue";
import type { Localhost } from "@/types/localhosts";
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const hosts = useHostsStore();

// Computed property to sort hosts by threat score (descending)
const sortedHosts = computed(() => {
  return [...hosts.localhosts].sort((a, b) => b.threat_score - a.threat_score);
});

const isHostSelected = (hostIp: string): boolean => {
  return route.params.ip_address === hostIp;
};

// Function to determine color based on threat score
const getThreatScoreColor = (score: number): string => {
  if (score === 0) return '#00C853'; // Sharp green for zero alerts
  if (score >= 1 && score <= 24) return '#FFD600'; // Bright yellow for low alerts
  if (score >= 25 && score <= 50) return '#FF9800'; // Orange for medium alerts
  if (score >= 50 && score <= 75) return '#F44336'; // Bright red for high alerts
  return '#B71C1C'; // Crimson for very high alerts (100+)
};

const hostClickHandler = (host: Localhost) => {
  router.push({
    name: "host",
    params: { ip_address: host.ip_address },
  });
};

const getAlertIntervals = (ip_address: string): number[] => {
  return hosts.alertsSummary[ip_address]?.alert_intervals || [];
};
</script>

<style scoped>
.v-list {
  background-color: transparent;
}

.host-list {
  overflow-y: auto;
}

.host-list-item {
  margin-bottom: 8px;
  padding: 8px 16px;
  color: #b1b8c0;
  text-transform: uppercase;
  transition: background-color 0.2s ease;
}

.host-list-item.selected-host {
  background-color: rgba(66, 165, 245, 0.2);
  border-left: 3px solid #42a5f5;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 24px;
  border-radius: 50rem !important;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid transparent;
  filter: saturate(0.7) brightness(0.8);
}


.host-info {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
