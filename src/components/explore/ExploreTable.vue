<template>
  <v-sheet rounded="lg" height="100%" color="#090c10">
    <v-card-title class="d-flex align-center px-4 py-3">
      <span class="text-h6">Network Flows</span>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-refresh"
        variant="text"
        size="small"
        @click="$emit('refresh')"
        :loading="loading"
      ></v-btn>
    </v-card-title>
    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="data"
      :items-per-page="pageSize"
      :page="currentPage + 1"
      :server-items-length="totalItems"
      @update:page="handlePageChange"
      class="explore-table"
      density="compact"
      :loading="loading"
      :no-data-text="'No flows found'"
    >
      <!-- Protocol Column -->
      <template v-slot:item.protocol="{ item }">
        <span class="text-caption">{{ getProtocolName(item.protocol) }}</span>
      </template>

      <!-- IP Address formatting -->
      <template v-slot:item.src_ip="{ item }">
        <div>{{ item.src_ip }}</div>
        <div class="text-caption">
          {{ item.src_country }} {{ item.src_isp ? `(${item.src_isp})` : "" }}
        </div>
      </template>

      <template v-slot:item.dst_ip="{ item }">
        <div>{{ item.dst_ip }}</div>
        <div class="text-caption">
          {{ item.dst_country }} {{ item.dst_isp ? `(${item.dst_isp})` : "" }}
        </div>
      </template>

      <!-- Formatted date -->
      <template v-slot:item.flow_start="{ item }">
        {{ formatDate(item.flow_start) }}
      </template>

      <template v-slot:item.last_seen="{ item }">
        {{ formatDate(item.last_seen) }}
      </template>

      <!-- Bytes with formatting -->
      <template v-slot:item.bytes="{ item }">
        {{ formatBytes(item.bytes) }}
      </template>

      <!-- Times seen with badge -->
      <template v-slot:item.times_seen="{ item }">
        <v-chip
          size="small"
          :color="getTimesSeenColor(item.times_seen)"
          text-color="white"
          class="text-caption"
        >
          {{ item.times_seen }}
        </v-chip>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { ExploreFlow } from "@/types/explore";
import { getProtocolName } from "@/utils/protocol";
import { formatDate } from "@/utils/date";
import { formatBytes } from "@/utils/filesize";

defineProps<{
  data: ExploreFlow[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalItems?: number;
}>();

const emit = defineEmits<{
  (e: "changePage", page: number): void;
  (e: "refresh"): void;
}>();

const headers = computed(() => [
  { title: "Flow ID", key: "flow_id", sortable: false },
  { title: "Source IP", key: "src_ip", sortable: false },
  { title: "Destination IP", key: "dst_ip", sortable: false },
  { title: "Source Port", key: "src_port", sortable: false },
  { title: "Dest Port", key: "dst_port", sortable: false },
  { title: "Protocol", key: "protocol", sortable: false },
  { title: "Flow Start", key: "flow_start", sortable: false },
  { title: "Last Seen", key: "last_seen", sortable: false },
  { title: "Packets", key: "packets", sortable: false },
  { title: "Bytes", key: "bytes", sortable: false },
  { title: "Times Seen", key: "times_seen", sortable: false },
]);

const handlePageChange = (page: number) => {
  emit("changePage", page - 1); // v-data-table uses 1-based pages, convert back to 0-based
};

// Get color based on times seen
const getTimesSeenColor = (timesSeen: number) => {
  if (timesSeen <= 1) return "blue";
  if (timesSeen <= 5) return "amber-darken-2";
  return "red";
};
</script>

<style scoped>
.explore-table {
  width: 100%;
}

:deep(.v-data-table) {
  background-color: transparent !important;
}

:deep(.v-data-table__tr) {
  cursor: pointer;
}

:deep(.v-data-table__tr:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
