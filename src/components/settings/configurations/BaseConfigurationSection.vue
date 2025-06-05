<template>
  <div>
    <!-- Use v-expansion-panel when not in standalone mode -->
    <v-expansion-panel
      v-if="!standalone"
      :value="category"
      color="background-100"
    >
      <v-expansion-panel-title>
        <h3>{{ category }}</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left" style="width: 40%">Setting</th>
            </tr>
            <tr>
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

    <!-- Just use the table directly when in standalone mode -->
    <v-table v-else>
      <thead>
        <tr>
          <th class="text-left" colspan="2">Setting</th>
        </tr>
        <tr>
          <slot name="table-headers"></slot>
        </tr>
      </thead>
      <tbody>
        <tr v-for="setting in settings" :key="setting.key">
          <td class="setting-name-cell">
            <div class="font-weight-medium">{{ setting.displayName }}</div>
          </td>
          <slot name="setting-row" :setting="setting"></slot>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import type { ConfigurationSetting } from "@/types/configurations";

interface Props {
  category: string;
  settings: ConfigurationSetting[];
  standalone?: boolean;
}

defineProps<Props>();
</script>

<style scoped>
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
  vertical-align: top; /* Change this to middle, bottom, etc. as needed */
  /* background-color: #0d1117 !important; */
}

h3 {
  color: rgba(var(--v-theme-on-surface), 0.87);
  font-weight: 500;
}

.setting-name-cell {
  width: 175px;
  min-width: max-content;
}

.font-weight-medium {
  font-weight: 500;
  vertical-align: top;
  width: 175px;
  padding-top: 11px;
}
</style>
