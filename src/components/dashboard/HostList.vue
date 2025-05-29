<template>
  <v-sheet rounded="lg" height="100%" color="#0d1117" class="host-list custom-scrollbar">
    <!-- Search Filter -->
    <div class="search-container pa-3">
      <v-text-field
        v-model="searchTerm"
        density="compact"
        variant="outlined"
        placeholder="Search hosts..."
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="search-field"
        clearable
      ></v-text-field>
    </div>
    
    <v-list>
      <v-list-item
        v-for="host in filteredHosts"
        :key="host.ip_address"
        class="host-list-item"
        :class="{ 'selected-host': isHostSelected(host.ip_address) }"
        @click="hostClickHandler(host)"
      >
        <div class="d-flex align-center w-100">
          <!-- Linux Icon with dynamic color matching threat score -->
          <img 
            :src="`/deviceicons/${host.icon}.svg`"
            :alt="host.icon"
            class="host-icon mr-2"
            :style="{ filter: `brightness(0) invert(1) drop-shadow(0 0 1px ${getThreatScoreColor(host.threat_score)})` }"
          />
          
          <!-- Threat Score -->
          <div 
            class="threat-score-badge"
            :style="{ 
              backgroundColor: getThreatScoreColor(host.threat_score),
              color: getTextColorForBackground(host.threat_score)
            }"
          >
            {{ host.threat_score }}
          </div>
          
          <!-- Host Info -->
          <div class="host-info ml-2">
            {{ host.local_description || host.ip_address }}
          </div>
          
          <AlertBars :alert-intervals="getAlertIntervals(host.ip_address)" class="ml-auto" />
        </div>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<script setup lang="ts">
import { useHostsStore } from "@/stores/hosts";
import { useRouter } from 'vue-router';
import AlertBars from "@/components/base/AlertBars.vue";
import type { Localhost } from "@/types/localhosts";
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const hosts = useHostsStore();

// Computed property to sort hosts by threat score (descending)
const sortedHosts = computed(() => {
  return [...hosts.localhosts].sort((a, b) => b.threat_score - a.threat_score);
});

const isHostSelected = (hostIp: string): boolean => {
  return route.params.ip_address === hostIp;
};

// Function to determine color based on threat score
const getThreatScoreColor = (score: number): string => {
  if (score === 0) return '#00C853'; // Sharp green for zero alerts
  if (score >= 1 && score <= 24) return '#FFD600'; // Bright yellow for low alerts
  if (score >= 25 && score <= 50) return '#FF9800'; // Orange for medium alerts
  if (score >= 50 && score <= 75) return '#F44336'; // Bright red for high alerts
  return '#B71C1C'; // Crimson for very high alerts (100+)
};

// Function to determine text color for dynamic backgrounds
const getTextColorForBackground = (score: number): string => {
  // Get the background color first
  const bgColor = getThreatScoreColor(score);
  
  // Extract RGB values (ignoring any possible alpha)
  let r, g, b;
  
  if (bgColor.startsWith('#')) {
    // Handle hex colors
    const hex = bgColor.substring(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    // Default to white text if color format is unknown
    return 'rgba(255, 255, 255, 0.87)';
  }
  
  // Calculate relative luminance using perceived brightness formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return semi-transparent white or black with reduced opacity for less contrast
  return luminance > 0.6 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.87)';
};

const hostClickHandler = (host: Localhost) => {
  router.push({
    name: "host",
    params: { ip_address: host.ip_address },
  });
};

const getAlertIntervals = (ip_address: string): number[] => {
  return hosts.alertsSummary[ip_address]?.alert_intervals || [];
};

// Add a search term ref
const searchTerm = ref('');

// Add a computed property for filtered hosts
const filteredHosts = computed(() => {
  if (!searchTerm.value.trim()) {
    return sortedHosts.value; // Return all sorted hosts if search is empty
  }
  
  const searchLower = searchTerm.value.toLowerCase();
  return sortedHosts.value.filter(host => {
    // Search in IP address
    if (host.ip_address.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Search in description (if available)
    if (host.local_description && 
        host.local_description.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Optionally search in other fields like hostname, category, etc.
    
    return false;
  });
});
</script>

<style scoped>
.v-list {
  background-color: transparent;
}

.host-list {
  overflow-y: auto;
}

.host-list-item {
  margin-bottom: 8px;
  padding: 8px 16px;
  color: #b1b8c0;
  text-transform: uppercase;
  transition: background-color 0.2s ease;
}

.host-list-item.selected-host {
  background-color: rgba(66, 165, 245, 0.2);
  border-left: 3px solid #42a5f5;
}

.host-icon {
  width: 24px;
  height: 24px;
  opacity: 1;
  filter: brightness(0) invert(1); /* Makes the SVG white */
}

.threat-score-badge {
  min-width: 22px;
  height: 22px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.host-info {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-container {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #0d1117;
}

.search-field {
  /* Optional: customize the search field appearance */
  background-color: #161b22;
}

.search-field :deep(.v-field__input) {
  color: #b1b8c0;
}

.search-field :deep(.v-field__outline) {
  opacity: 0.3;
}

/* Subtle custom scrollbar */
.custom-scrollbar {
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

/* Chrome, Edge, Safari */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  border: none;
}

/* For completely hiding the scrollbar but keeping functionality */
/* Uncomment this if you want to hide it completely
.custom-scrollbar::-webkit-scrollbar {
  width: 0px;
}

.custom-scrollbar {
  scrollbar-width: none;  
  -ms-overflow-style: none;
}
*/
</style>
