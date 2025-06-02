<template>
  <v-expansion-panel :value="category" color="background-100">
    <v-expansion-panel-title>
      <h3>{{ category }}</h3>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-table>
        <thead>
          <tr>
            <th class="text-left" style="width: 40%">Setting</th>
            <slot name="table-headers"></slot>
          </tr>
        </thead>
        <tbody>
          <tr v-for="setting in settings" :key="setting.key">
            <td>
              <div class="font-weight-medium">{{ setting.displayName }}</div>
            </td>
            <slot name="setting-row" :setting="setting"></slot>
          </tr>
        </tbody>
      </v-table>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import type { ConfigurationSetting } from "@/types/configurations";

interface Props {
  category: string;
  settings: ConfigurationSetting[];
}

defineProps<Props>();
</script>

<style scoped>
.v-expansion-panel {
  /* background-color: #0d1117 !important; */
}

.v-expansion-panel-title {
  /* background-color: #0d1117 !important; */
}

.v-expansion-panel-text {
  background-color: #0d1117 !important;
  padding: 0px;
}

.v-table {
  background-color: transparent !important;
}

.v-table th {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.87);
  /* background-color: #0d1117 !important; */
}

.v-table td {
  vertical-align: middle;
  /* background-color: #0d1117 !important; */
}

.v-table tbody tr {
  /* background-color: #0d1117 !important; */
}

.v-table tbody tr:hover {
  /* background-color: rgba(255, 255, 255, 0.05) !important; */
}

h3 {
  color: rgba(var(--v-theme-on-surface), 0.87);
  font-weight: 500;
}

.font-weight-medium {
  font-weight: 500;
}
</style>
