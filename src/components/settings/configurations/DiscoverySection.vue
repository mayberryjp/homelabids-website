<template>
  <StandardConfigurationSection 
    :category="'Discovery'"
    :settings="settings"
    :updating-configs="updatingConfigs"
    :standalone="standalone"
    @updateConfigurationValue="$emit('updateConfigurationValue', $event)"
  />
</template>

<script setup lang="ts">
import StandardConfigurationSection from './StandardConfigurationSection.vue';
import type { ConfigurationSetting } from "@/types/configurations";

interface Props {
  settings: ConfigurationSetting[];
  updatingConfigs?: Record<string, boolean>;
  standalone?: boolean;
}

defineProps<Props>();

defineEmits<{
  updateConfigurationValue: [setting: ConfigurationSetting];
}>();
</script>
