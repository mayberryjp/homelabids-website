<template>
  <v-row class="ma-0 rounded-lg">
    <!-- Status Cards -->
    <v-col
      cols="12"
      sm="6"
      md="3"
      v-for="(stat, index) in statusStats"
      :key="index"
      class="bg-transparent"
    >
      <v-card
        variant="plain"
        class="text-center pa-4 bg-transparent border-none"
      >
        <div class="text-subtitle-1 mb-1">{{ stat.label }}</div>
        <div class="stat-value">
          {{ stat.value }}
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Localhost } from "@/types/localhosts";
import { formatDate } from "@/utils/date";

// Receive host detail as prop
const props = defineProps<{
  hostDetail: Localhost;
}>();

// Safe getter for host properties
const getHostValue = (value: string | null | undefined) => {
  return value && value !== "null" ? value : "-";
};

// Prepare stats array
const statusStats = computed(() => [
  {
    label: "First Seen",
    value: formatDate(props.hostDetail?.first_seen),
  },
  {
    label: "DNS Hostname",
    value: getHostValue(props.hostDetail?.dns_hostname),
  },
  {
    label: "DHCP Hostname",
    value: getHostValue(props.hostDetail?.lease_hostname),
  },
  {
    label: "OS Fingerprint",
    value: getHostValue(props.hostDetail?.os_fingerprint),
  },
]);
</script>

<style scoped>
.stat-value {
  font-size: 18px;
  font-weight: 600;
}
</style>
