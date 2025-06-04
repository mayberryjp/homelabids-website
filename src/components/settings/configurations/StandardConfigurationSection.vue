<template>
  <BaseConfigurationSection :category="category" :settings="settings" :standalone="standalone">
    <template #setting-row="{ setting }">
      <div class="setting-row-flex">
        <v-switch
          v-if="setting.type === 'Boolean/Toggle'"
          :model-value="getBooleanValue(setting.value)"
          @update:model-value="handleBooleanChange(setting, $event)"
          hide-details
          density="compact"
          color="primary"
          :loading="props.updatingConfigs?.[setting.key]"
          :disabled="props.updatingConfigs?.[setting.key]"
          class="ml-4"
        ></v-switch>
        <v-text-field
          v-else-if="setting.type.includes('Text')"
          v-model="setting.value"
          @focus="handleFocus(setting)"
          @blur="handleBlur(setting)"
          @keyup.enter="updateConfigurationValue(setting)"
          :type="setting.type === 'Text/Int' ? 'number' : 'text'"
          :loading="props.updatingConfigs?.[setting.key]"
          :disabled="props.updatingConfigs?.[setting.key]"
          hide-details
          density="compact"
          variant="outlined"
          class="ml-4"
        ></v-text-field>
        <v-text-field
          v-else
          v-model="setting.value"
          @focus="handleFocus(setting)"
          @blur="handleBlur(setting)"
          @keyup.enter="updateConfigurationValue(setting)"
          :loading="props.updatingConfigs?.[setting.key]"
          :disabled="props.updatingConfigs?.[setting.key]"
          hide-details
          density="compact"
          variant="outlined"
          class="ml-4"
        ></v-text-field>
      </div>
      <div class="setting-meta">
        <div class="setting-details">{{ setting.details }}</div>
        <div class="setting-default">Default: <span>{{ setting.default }}</span></div>
        <div class="setting-suggested">Suggested: <span>{{ setting.suggested }}</span></div>
      </div>
    </template>
  </BaseConfigurationSection>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseConfigurationSection from "./BaseConfigurationSection.vue";
import type { ConfigurationSetting } from "@/types/configurations";

interface Props {
  category: string;
  settings: ConfigurationSetting[];
  updatingConfigs?: Record<string, boolean>;
  standalone?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateConfigurationValue: [setting: ConfigurationSetting];
}>();

const originalValues = ref<Record<string, any>>({});

const getBooleanValue = (value: any): boolean => {
  // Convert 1/0, "1"/"0", "true"/"false" to proper boolean
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return value === '1' || value.toLowerCase() === 'true';
  }
  return Boolean(value);
};

const handleBooleanChange = (setting: ConfigurationSetting, newValue: boolean | null) => {
  // Convert boolean back to the format expected by the API (likely 1/0)
  const boolValue = newValue ?? false;
  setting.value = boolValue ? 1 : 0;
  updateConfigurationValue(setting);
};

const handleFocus = (setting: ConfigurationSetting) => {
  originalValues.value[setting.key] = setting.value;
};

const handleBlur = (setting: ConfigurationSetting) => {
  if (originalValues.value[setting.key] !== setting.value) {
    updateConfigurationValue(setting);
  }
};

const updateConfigurationValue = (setting: ConfigurationSetting) => {
  emit("updateConfigurationValue", setting);
};
</script>

<style scoped>
.v-text-field {
  max-width: 100%;
}
.setting-name {
  vertical-align: top !important;
  padding-top: 8px;

}
.setting-title {
  font-weight: 600;
  font-size: 1rem;
  color: #e0e6ed;
  word-break: break-word;

}


.setting-row-flex {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 48px;
  margin-bottom: 2px;

}
.setting-meta {
  font-size: 12px;
  color: #b1b8c0;
  margin-top: 2px;
  margin-bottom: 8px;
  line-height: 1.4;

}

.setting-name-cell {
  vertical-align: top;
  padding-top: 11px;
}

.setting-details {
  margin-bottom: 2px;
  margin-left: 20px;
}
.setting-default,
.setting-suggested {
  color: #8ab4f8;
  display: inline-block;
  margin-right: 12px;
  margin-left: 25px;
}
.setting-default span,
.setting-suggested span {
  color: #b1b8c0;
}
th.align-top,
td.align-top {
  vertical-align: top !important;
}
</style>
