<template>
  <div class="alert-bars">
    <div
      v-for="(count, index) in alertIntervals"
      :key="index"
      class="alert-bar"
      :class="getAlertClass(count)"
      :style="{
        width: `${width}px`,
        height: `${height}px`,
      }"
      :title="`${count} alerts`"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  alertIntervals: {
    type: Array as () => number[],
    default: () => [],
  },
  height: {
    type: Number,
    default: 16,
  },
  width: {
    type: Number,
    default: 5,
  },
});

const getAlertClass = (alertCount: number): string => {
  if (alertCount === 0) return "alert-none";
  if (alertCount <= 1) return "alert-low";
  if (alertCount <= 5) return "alert-medium";
  if (alertCount <= 20) return "alert-high";
  return "alert-critical";
};
</script>

<style scoped>
.alert-bars {
  display: flex;
  gap: 2px;
}

.alert-bar {
  margin: 1px;
  border-radius: 50rem;
  display: inline-block;
  box-sizing: border-box;
  transition: transform 0.2s ease;
}

.alert-none {
  background-color: #00c853;
}

.alert-low {
  background-color: #f0b969;
}

.alert-medium {
  background-color: #f86b40;
}

.alert-high {
  background-color: #f43b63;
}

.alert-critical {
  background-color: #a2344c;
}

.alert-bar:hover {
  transform: scale(1.5);
}
</style>
