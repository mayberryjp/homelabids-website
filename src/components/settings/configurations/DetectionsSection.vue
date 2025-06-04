<template>
  <BaseConfigurationSection 
    :category="category" 
    :settings="settings"
    :standalone="standalone"
  >
    <template #table-headers>
      <th class="text-left" style="width: 40%">Description</th>
      <th class="text-center" style="width: 20%">Alert</th>
      <th class="text-center" style="width: 20%">Notify</th>
      <th class="text-center" style="width: 20%">ReNotify</th>
    </template>
    
    <template #setting-row="{ setting }">
      <td>
        <div class="setting-meta">
          <div class="setting-details">{{ setting.details }}</div>
          <div class="setting-default">Default: <span>{{ setting.default }}</span></div>
          <div class="setting-suggested">Suggested: <span>{{ setting.suggested }}</span></div>
        </div>
      </td>
      <td class="text-center">
        <v-checkbox
          v-model="setting.alert"
          @change="handleAlertChange(setting)"
          :disabled="props.updatingConfigs?.[setting.key]"
          hide-details
          density="compact"
          class="d-flex justify-center"
        ></v-checkbox>
      </td>
      <td class="text-center">
        <v-checkbox
          v-model="setting.notify"
          @change="handleNotifyChange(setting)"
          :disabled="props.updatingConfigs?.[setting.key]"
          hide-details
          density="compact"
          class="d-flex justify-center"
        ></v-checkbox>
      </td>
      <td class="text-center">
        <v-checkbox
          v-model="setting.reNotify"
          @change="handleReNotifyChange(setting)"
          :disabled="props.updatingConfigs?.[setting.key]"
          hide-details
          density="compact"
          class="d-flex justify-center"
        ></v-checkbox>
      </td>
    </template>
  </BaseConfigurationSection>
</template>

<script setup lang="ts">
import BaseConfigurationSection from './BaseConfigurationSection.vue';
import type { ConfigurationSetting } from "@/types/configurations";

interface Props {
  category: string;
  settings: ConfigurationSetting[];
  updatingConfigs?: Record<string, boolean>;
  standalone?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateDetectionValue: [setting: ConfigurationSetting];
}>();

const handleAlertChange = (setting: ConfigurationSetting) => {
  // If alert is unchecked, uncheck notify and reNotify
  if (!setting.alert) {
    setting.notify = false;
    setting.reNotify = false;
  }
  updateDetectionValue(setting);
};

const handleNotifyChange = (setting: ConfigurationSetting) => {
  // If notify is checked, check alert
  if (setting.notify) {
    setting.alert = true;
  }
  // If notify is unchecked, uncheck reNotify
  if (!setting.notify) {
    setting.reNotify = false;
  }
  updateDetectionValue(setting);
};

const handleReNotifyChange = (setting: ConfigurationSetting) => {
  // If reNotify is checked, check alert and notify
  if (setting.reNotify) {
    setting.alert = true;
    setting.notify = true;
  }
  updateDetectionValue(setting);
};

const updateDetectionValue = (setting: ConfigurationSetting) => {
  emit('updateDetectionValue', setting);
};
</script>

<style scoped>
.setting-meta {
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
  margin-top: 8px;
}

.setting-details {
  font-size: 14px;
  color: #666;
}

.setting-default,
.setting-suggested {
  font-size: 12px;
  color: #999;
}
</style>
