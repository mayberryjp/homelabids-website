<template>
  <BaseConfigurationSection :category="category" :settings="settings">
    <template #table-headers>
      <th class="text-left" style="width: 60%">Value</th>
    </template>

    <template #setting-row="{ setting }">
      <td>
        <!-- Boolean/Toggle settings -->
        <v-switch
          v-if="setting.type === 'Boolean/Toggle'"
          :model-value="getBooleanValue(setting.value)"
          @update:model-value="handleBooleanChange(setting, $event)"
          hide-details
          density="compact"
          color="primary"
          :loading="props.updatingConfigs?.[setting.key]"
          :disabled="props.updatingConfigs?.[setting.key]"
        ></v-switch>
        <!-- Text/String and Text/Int settings -->
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
        ></v-text-field>

        <!-- Fallback for other types -->
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
        ></v-text-field>
      </td>
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
  max-width: 300px;
}
</style>
