<template>
  <v-sheet
    rounded="lg"
    height="100%"
    color="#0d1117 !important"
    class="explore-table-sheet"
  >
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

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="data"
      :items-length="totalItems || 0"
      :loading="loading"
      :no-data-text="'No flows found'"
      class="explore-table"
      density="compact"
      @update:options="handleOptionsUpdate"
      :items-per-page-options="[itemsPerPage]"
    >
      <!-- Protocol Column -->
      <template v-slot:item.protocol="{ item }">
        <span class="text-caption">{{ getProtocolName(item.protocol) }}</span>
      </template>

      <!-- IP Address formatting -->
      <template v-slot:item.src_ip="{ item }">
        <div>{{ item.src_ip }}</div>
      </template>

      <template v-slot:item.dst_ip="{ item }">
        <div>{{ item.dst_ip }}</div>
      </template>

      <template v-slot:item.last_seen="{ item }">
        {{ formatDate(item.last_seen) }}
      </template>

      <!-- Bytes with formatting -->
      <template v-slot:item.bytes="{ item }">
        {{ formatBytes(item.bytes) }}
      </template>

      <template v-slot:item.src_dns="{ item }">
        <span class="details-ellipsis" :title="getSourceDetails(item)">
          {{ getSourceDetails(item) }}
        </span>
      </template>

      <template v-slot:item.dst_dns="{ item }">
        <span class="details-ellipsis" :title="getDestinationDetails(item)">
          {{ getDestinationDetails(item) }}
        </span>
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
    </v-data-table-server>
  </v-sheet>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { ExploreFlow } from "@/types/explore";
import { getProtocolName } from "@/utils/protocol";
import { formatDate } from "@/utils/date";
import { formatBytes } from "@/utils/filesize";

defineProps<{
  data: ExploreFlow[];
  loading: boolean;
  totalItems?: number;
}>();

const emit = defineEmits<{
  (e: "changePage", page: number): void;
  (e: "changeItemsPerPage", itemsPerPage: number): void;
  (e: "refresh"): void;
}>();

const itemsPerPage = ref(100);

const headers = computed(() => [
  { title: "Source IP", key: "src_ip", sortable: false },
  { title: "Source Details", key: "src_dns", sortable: false },
  { title: "Destination IP", key: "dst_ip", sortable: false },
  { title: "Destination Details", key: "dst_dns", sortable: false },
  { title: "Source Port", key: "src_port", sortable: false },
  { title: "Dest Port", key: "dst_port", sortable: false },
  { title: "Protocol", key: "protocol", sortable: false },
  { title: "Last Seen", key: "last_seen", sortable: false },
  { title: "Packets", key: "packets", sortable: false },
  { title: "Bytes", key: "bytes", sortable: false },
  { title: "Times Seen", key: "times_seen", sortable: false },
]);

const handleOptionsUpdate = ({
  page,
  itemsPerPage: newItemsPerPage,
}: {
  page: number;
  itemsPerPage: number;
}) => {
  if (newItemsPerPage !== itemsPerPage.value) {
    itemsPerPage.value = newItemsPerPage;
    emit("changeItemsPerPage", newItemsPerPage);
  }
  emit("changePage", page - 1); // v-data-table-server uses 1-based pages, convert to 0-based
};

// Get color based on times seen
const getTimesSeenColor = (timesSeen: number) => {
  if (timesSeen <= 1) return "blue";
  if (timesSeen <= 5) return "amber-darken-2";
  return "red";
};

const getSourceDetails = (item: ExploreFlow) => {
  return (
    item.src_dns?.trim() ||
    item.src_isp?.trim() ||
    item.src_country?.trim() ||
    ""
  );
};

const getDestinationDetails = (item: ExploreFlow) => {
  return (
    item.dst_dns?.trim() ||
    item.dst_isp?.trim() ||
    item.dst_country?.trim() ||
    ""
  );
};
</script>

<style scoped>
.explore-table-sheet {
  /* Optional: add padding or shadow for more emphasis */
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.explore-table {
  width: 100%;
}

/* Prevent line breaks in all table cells */
:deep(.v-data-table__td) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.details-ellipsis {
  display: inline-block;
  max-width: 200px; /* ~50 characters in monospace, adjust as needed */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
</style>
