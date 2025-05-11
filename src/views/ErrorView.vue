<template>
  <v-container class="fill-height justify-center align-center text-center">
    <v-card max-width="600" class="mx-auto pa-6" elevation="4">
      <v-card-item>
        <v-card-title class="text-h3 mb-5">{{ computedTitle }}</v-card-title>
      </v-card-item>

      <v-card-text>
        <v-img
          :src="errorImage"
          alt="Error Illustration"
          class="mb-5"
          height="200"
          contain
        ></v-img>

        <p class="text-h6 mb-5">{{ computedMessage }}</p>
        
        <p class="text-body-1 mb-6" v-if="computedErrorCode">Error code: {{ computedErrorCode }}</p>
        
        <v-btn 
          color="primary" 
          size="large" 
          block
          @click="goBack"
          class="mb-4"
        >
          Go Back
        </v-btn>
        
        <v-btn 
          color="secondary" 
          size="large" 
          block
          :to="{ name: 'dashboard' }"
        >
          Back to Dashboard
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Props with default values
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  errorCode: {
    type: [String, Number],
    default: ''
  },
  errorImage: {
    type: String,
    default: '/logo.png' // Default image from public folder
  }
});

// Go back action
const goBack = () => {
  router.back();
};

// Get error information from route params/query if not provided as props
const computedTitle = computed(() => 
  props.title || route.params.title || route.query.title || 'Page Not Found'
);

const computedMessage = computed(() => 
  props.message || 
  route.params.message || 
  route.query.message || 
  'The page you are looking for might have been removed or is temporarily unavailable.'
);

const computedErrorCode = computed(() => 
  props.errorCode || route.params.errorCode || route.query.errorCode || '404'
);
</script>