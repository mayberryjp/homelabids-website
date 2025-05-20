<template>
  <v-sheet rounded="lg" height="100%" color="#0d1117">
    <v-list>
      <v-list-item
        v-for="host in hosts.localhosts"
        :key="host.ip_address"
        class="host-list-item"
        @click="hostClickHandler(host)"
      >
        <div class="d-flex align-center w-100">
          <div
            class="status-indicator"
            :class="host.acknowledged ? 'acknowledged' : 'unacknowledged'"
          >
            {{ host.acknowledged ? "OK" : "NEW" }}
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AlertBars from "@/components/base/AlertBars.vue";
import type { Localhost } from "@/types/localhosts";

const router = useRouter();
const hosts = useHostsStore();

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

.host-list-item {
  margin-bottom: 8px;
  padding: 8px 16px;
  color: #b1b8c0;
  text-transform: uppercase;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 24px;
  border-radius: 50rem !important;
  color: black;;
  font-size: 12px;
  font-weight: bold;

}

.acknowledged {
  background-color: #5cdd8b;
}

.unacknowledged {
  background-color: #cf8e13;
}

.host-info {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
