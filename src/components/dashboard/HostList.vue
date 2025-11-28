<template>
  <v-sheet rounded="lg" height="100%" color="#0d1117" class="host-list custom-scrollbar">
    <!-- Site Risk Header -->
    <div class="site-risk-header pa-6">
      <div class="site-risk-header-content">
        <span class="site-risk-label">SITE RISK: </span>

        <span class="site-risk-desc" :style="{ color: getThreatScoreColor(siteRiskScore) }">
          {{ siteRiskLevel }} ({{ siteRiskScore }})
        </span>
      </div>
    </div>
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
        @click:clear="searchTerm = ''"
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
          <!-- Icon Container with fixed width for alignment -->
          <div class="icon-container">
            <!-- SVG Icon with dynamic color matching threat score -->
            <InlineSvg 
              :name="host.icon || 'DEFAULT'" 
              :color="getThreatScoreColor(host.threat_score)"
              :size="24"
            />
          </div>
          
          <!-- Host Info with consistent left margin -->
          <div class="host-info">
            {{
              host.local_description
              || host.ip_address
              || (host.mac_address ? host.mac_address.toUpperCase() : "")
            }}
          </div>
          
          <AlertBars :alert-intervals="getAlertIntervals(host.ip_address)" class="ml-auto mr-2" />
          
          <!-- Threat Score (moved after alert bar) -->
          <div 
            class="threat-score-text"
            :style="{ color: getThreatScoreColor(host.threat_score) }"
          >
            {{ host.threat_score }}
          </div>
        </div>
      </v-list-item>
    </v-list>

    <!-- Dialog for no hosts found -->
    <v-dialog v-model="showNoHostsDialog" persistent width="400">
      <v-card>
        <v-card-title class="text-h6">No Hosts Found</v-card-title>
        <v-card-text>
          No local hosts were found.<br>
          You are being redirected to the setup pages.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showNoHostsDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup lang="ts">
import { useHostsStore } from "@/stores/hosts";
import { useRouter } from 'vue-router';
import AlertBars from "@/components/base/AlertBars.vue";
import InlineSvg from "@/components/base/InlineSvg.vue";  // Import new component
import type { Localhost } from "@/types/localhosts";
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const router = useRouter();
const hosts = useHostsStore();
const route = useRoute();

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

const hostClickHandler = (host: Localhost) => {
  const param = host.ip_address || host.mac_address;
  if (param) {
    router.push({
      name: "host",
      params: { ip_address: param },
    });
  }
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

// Compute the average threat score for all hosts
const siteRiskScore = computed(() => {
  if (!hosts.localhosts.length) return 0;
  const sum = hosts.localhosts.reduce((acc, h) => acc + (h.threat_score || 0), 0);
  return Math.round(sum / hosts.localhosts.length);
});

// Compute a risk level label based on the average threat score
const siteRiskLevel = computed(() => {
  const score = siteRiskScore.value;
  if (score === 0) return "SAFE";
  if (score > 0 && score <= 24) return "LOW";
  if (score > 24 && score <= 50) return "MEDIUM";
  if (score > 50 && score <= 75) return "HIGH";
  return "CRITICAL";
});

const showNoHostsDialog = ref(false);

onMounted(async () => {
  try {
    await hosts.fetchLocalhosts?.();
    // If no hosts found, redirect
    if (hosts.localhosts.length === 0) {
      showNoHostsDialog.value = true;
      setTimeout(() => {
        router.push({ name: 'settings' });
      }, 2500);
    }
  } catch (error) {
    showNoHostsDialog.value = true;
    setTimeout(() => {
      router.push({ name: 'settings' });
    }, 2500);
  }
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
  width: 30px;
  height: 30px;
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
  padding-left: 0; /* Remove any padding */
  margin-left: 0; /* Remove any margin */
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Fixed width to ensure alignment */
  min-width: 40px; /* Prevent shrinking */
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

.threat-score-text {
  font-size: 14px;
  font-weight: bold;
  width: 30px; /* Fixed width for 3 digits */
  min-width: 30px; /* Prevent shrinking */
  text-align: right; /* Right align the text */
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

.site-risk-header {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #161b22;
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
  justify-content: center;
}

.site-risk-label {
  font-size: 28px;
  font-weight: 700;
  color: #b1b8c0;
  letter-spacing: 1px;
  margin-right: 8px;
}

.site-risk-score {
  font-size: 28px;
  font-weight: 900;
  margin-right: 12px;
}

.site-risk-desc {
  font-size: 28px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.85;
}
</style>
