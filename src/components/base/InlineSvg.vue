<template>
  <div 
    class="inline-svg-container" 
    v-html="svgContent"
    :style="svgStyle"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { loadSvg } from '@/utils/svgLoader';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: [Number, String],
    default: 24
  }
});

const svgContent = ref('');
const loading = ref(false);

// Generate dynamic style based on props
const svgStyle = computed(() => {
  const style: Record<string, string> = {
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    display: 'inline-block'
  };
  
  if (props.color) {
    style.fill = props.color;
  }
  
  return style;
});

const loadSvgContent = async () => {
  if (!props.name) return;
  
  loading.value = true;
  svgContent.value = await loadSvg(props.name);
  loading.value = false;
};

// Load SVG on mount
onMounted(loadSvgContent);

// Reload SVG if name changes
watch(() => props.name, loadSvgContent);
</script>

<style scoped>
.inline-svg-container :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>