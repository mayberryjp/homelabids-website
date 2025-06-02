<template>
  <BaseConfigurationSection 
    :category="category" 
    :settings="settings"
  >
    <template #table-headers>
      <th class="text-center" style="width: 20%">Alert</th>
      <th class="text-center" style="width: 20%">Notify</th>
      <th class="text-center" style="width: 20%">Re-Notify</th>
    </template>
    
    <template #setting-row="{ setting }">
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
