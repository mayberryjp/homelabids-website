<template>
  <div class="app-skeleton">
    <v-card :color="color" class="mb-4">
      <v-skeleton-loader
        :type="type"
        :loading="true"
        :color="color"
      ></v-skeleton-loader>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: string;
  color?: string;
}>();
</script>

<style scoped>
.app-skeleton {
  width: 100%;
}

:deep(.v-skeleton-loader__bone) {
  background-color: #151922 !important;
}

:deep(.v-skeleton-loader__bone::after) {
  background: linear-gradient(90deg, 
    transparent, 
    rgba(55, 65, 81, 0.3), 
    transparent
  ) !important;
}
</style>
