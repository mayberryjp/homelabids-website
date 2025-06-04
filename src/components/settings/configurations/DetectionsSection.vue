<template>
  <BaseConfigurationSection 
    :category="category" 
    :settings="settings"
    :standalone="standalone"
  >
    <template #table-headers>
      <td></td>
      <td>
      <div class="detection-header-row">
        <div class="detection-header-cell">Alert</div>
        <div class="detection-header-cell">Notify</div>
        <div class="detection-header-cell">ReNotify</div>
      </div>
      </td>
    </template>

    <template #setting-row="{ setting }">
      <td>
      <div class="detection-setting-row">

        <div class="detection-setting-cell">
          <v-checkbox
            v-model="setting.alert"
            @change="handleAlertChange(setting)"
            :disabled="props.updatingConfigs?.[setting.key]"
            hide-details
            density="compact"
            class="d-flex justify-center"
          ></v-checkbox>
        </div>
        <div class="detection-setting-cell">
          <v-checkbox
            v-model="setting.notify"
            @change="handleNotifyChange(setting)"
            :disabled="props.updatingConfigs?.[setting.key]"
            hide-details
            density="compact"
            class="d-flex justify-center"
          ></v-checkbox>
        </div>
        <div class="detection-setting-cell">
          <v-checkbox
            v-model="setting.reNotify"
            @change="handleReNotifyChange(setting)"
            :disabled="props.updatingConfigs?.[setting.key]"
            hide-details
            density="compact"
            class="d-flex justify-center"
          ></v-checkbox>
        </div>
      </div>
      <div class="setting-meta">
        <div class="setting-details">{{ setting.details }}</div>
        <div class="setting-default">Default: <span>{{ setting.default }}</span></div>
        <div class="setting-suggested">Suggested: <span>{{ setting.suggested }}</span></div>
      </div>
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
.detection-header-row,
.detection-setting-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
}

.detection-header-cell,
.detection-setting-cell {
  flex: 1 1 0;
  text-align: center;
  padding: 8px 0;
}

.detection-header-cell {
  font-weight: bold;
  font-size: 16px;
  color: white;
}

.detection-label-cell {
  text-align: left;
  font-weight: 500;
  color: #ccc;
}

.setting-label {
  margin-left: 8px;
}

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
