<template>
  <div class="loader-container" :class="{ overlay: overlay, absolute: absolute, fixed: fixed }">
    <div class="loader-content">
      <div v-if="type === 'spinner'" class="spinner-loader">
        <v-progress-circular 
          indeterminate 
          :color="color" 
          :size="size" 
          :width="width"
        ></v-progress-circular>
      </div>

      <div v-else-if="type === 'dots'" class="dots-loader">
        <div class="dot" :style="{ backgroundColor: color }"></div>
        <div class="dot" :style="{ backgroundColor: color }"></div>
        <div class="dot" :style="{ backgroundColor: color }"></div>
      </div>

      <div v-else-if="type === 'pulse'" class="pulse-loader">
        <div class="circle" :style="{ borderColor: color }"></div>
      </div>

      <div v-else-if="type === 'logo'" class="logo-loader">
        <div class="logo-container">
          <img src="/logo.png" alt="Logo" width="64" height="64" />
          <v-progress-linear 
            indeterminate 
            :color="color" 
            class="mt-4" 
            :height="4"
          ></v-progress-linear>
        </div>
      </div>

      <div v-if="label && label.length > 0" class="loader-label mt-4">
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  // Type of loader animation
  type: {
    type: String,
    default: 'spinner', // spinner, dots, pulse, logo
    validator: (value: string) => ['spinner', 'dots', 'pulse', 'logo'].includes(value)
  },
  // Label text to display below the loader
  label: {
    type: String,
    default: ''
  },
  // Color of the loader
  color: {
    type: String,
    default: '#c73e54' // Using the rose color from your theme
  },
  // Display as overlay (darkens background)
  overlay: {
    type: Boolean,
    default: false
  },
  // Size for circular loaders
  size: {
    type: Number,
    default: 48
  },
  // Width for spinner stroke
  width: {
    type: Number,
    default: 4
  },
  // Position absolute within parent
  absolute: {
    type: Boolean,
    default: false
  },
  // Position fixed on screen
  fixed: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.loader-container.overlay {
  background-color: rgba(13, 17, 23, 0.85);
  z-index: 100;
}

.loader-container.absolute {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.loader-container.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader-label {
  color: #b1b8c0; 
  font-size: 16px;
  text-align: center;
}

/* Dots Loader */
.dots-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: dot-bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Pulse Loader */
.pulse-loader {
  position: relative;
}

.circle {
  width: 48px;
  height: 48px;
  border: 3px solid;
  border-radius: 50%;
  animation: pulse 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
}

/* Logo Loader */
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fade 2s infinite alternate;
}

@keyframes fade {
  0% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>