<template>
  <v-sheet class="settings-container" color="#0d1117">
    <v-row no-gutters>
      <!-- Left side tabs -->
      <v-col cols="12" sm="3">
        <v-tabs v-model="activeTab" direction="vertical" color="primary">
          <!-- Configuration tabs -->
          <v-tab value="home-network">Home Network</v-tab>
          <v-tab value="processes">Processes</v-tab>
          <v-tab value="processing">Processing</v-tab>
          <v-tab value="detections">Detections</v-tab>
          <v-tab value="detection-fine-tuning">Detection Fine Tuning</v-tab>

          <v-tab value="config-notifications">Notifications Config</v-tab>

          <v-tab value="discovery">Discovery</v-tab>
          <v-tab value="filtering">Filtering</v-tab>
          <v-tab value="homelab-ids">HomelabIDS Collaboration</v-tab>
          <!-- Advanced -->
          <v-tab value="advanced">Advanced</v-tab>
        </v-tabs>
      </v-col>

      <!-- Right side content -->
      <v-col cols="12" sm="9">
        <v-card-text>
          <v-window v-model="activeTab">
            <!-- Configuration Tabs -->

            <!-- Detections Settings -->
            <v-window-item value="detections">
              <h3>Detections</h3>
              <v-divider class="my-4"></v-divider>
              <detections-section
                v-if="groupedConfigurations['Detections']"
                category="Detections"
                :settings="groupedConfigurations['Detections']"
                :updating-configs="updatingConfigs"
                @updateDetectionValue="updateDetectionValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- Detection Fine Tuning Settings -->
            <v-window-item value="detection-fine-tuning">
              <h3>Detection Fine Tuning</h3>
              <v-divider class="my-4"></v-divider>
              <detection-fine-tuning-section
                v-if="groupedConfigurations['Detection Fine Tuning']"
                :settings="groupedConfigurations['Detection Fine Tuning']"
                :updating-configs="updatingConfigs"
                @updateConfigurationValue="updateConfigurationValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- Home Network Settings -->
            <v-window-item value="home-network">
              <h3>Home Network</h3>
              <v-divider class="my-4"></v-divider>
              <home-network-section
                v-if="groupedConfigurations['Home Network']"
                :settings="groupedConfigurations['Home Network']"
                :updating-configs="updatingConfigs"
                @updateConfigurationValue="updateConfigurationValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- Notifications Config Settings -->
            <v-window-item value="config-notifications">
              <h3>Notifications Configuration</h3>
              <v-divider class="my-4"></v-divider>
              <notifications-section
                v-if="groupedConfigurations['Notifications']"
                :settings="groupedConfigurations['Notifications']"
                :updating-configs="updatingConfigs"
                @updateConfigurationValue="updateConfigurationValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- Processes Settings -->
            <v-window-item value="processes">
              <h3>Processes</h3>
              <v-divider class="my-4"></v-divider>
              <processes-section
                v-if="groupedConfigurations['Processes']"
                :settings="groupedConfigurations['Processes']"
                :updating-configs="updatingConfigs"
                @updateConfigurationValue="updateConfigurationValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- Processing Settings -->
            <v-window-item value="processing">
              <h3>Processing</h3>
              <v-divider class="my-4"></v-divider>
              <processing-section
                v-if="groupedConfigurations['Processing']"
                :settings="groupedConfigurations['Processing']"
                :updating-configs="updatingConfigs"
                @updateConfigurationValue="updateConfigurationValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- Discovery Settings -->
            <v-window-item value="discovery">
              <h3>Discovery</h3>
              <v-divider class="my-4"></v-divider>
              <discovery-section
                v-if="groupedConfigurations['Discovery']"
                :settings="groupedConfigurations['Discovery']"
                :updating-configs="updatingConfigs"
                @updateConfigurationValue="updateConfigurationValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- Filtering Settings -->
            <v-window-item value="filtering">
              <h3>Filtering</h3>
              <v-divider class="my-4"></v-divider>
              <filtering-section
                v-if="groupedConfigurations['Filtering']"
                :settings="groupedConfigurations['Filtering']"
                :updating-configs="updatingConfigs"
                @updateConfigurationValue="updateConfigurationValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- HomelabIDS Collaboration Settings -->
            <v-window-item value="homelab-ids">
              <h3>HomelabIDS Collaboration</h3>
              <v-divider class="my-4"></v-divider>
              <homelab-i-d-s-collaboration-section
                v-if="groupedConfigurations['HomelabIDS Collaboration']"
                :settings="groupedConfigurations['HomelabIDS Collaboration']"
                :updating-configs="updatingConfigs"
                @updateConfigurationValue="updateConfigurationValue"
                standalone
              />
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
                class="ma-4"
              ></v-progress-circular>
            </v-window-item>

            <!-- Advanced Settings -->
            <v-window-item value="advanced">
              <h3>Advanced Settings</h3>
              <v-divider class="my-4"></v-divider>

              <advanced-settings></advanced-settings>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-col>
    </v-row>

    <!-- Save notification -->
    <v-snackbar
      v-model="showSaveNotification"
      :color="saveNotificationColor"
      timeout="3000"
    >
      {{ saveNotificationMessage }}
    </v-snackbar>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AdvancedSettings from "@/components/settings/AdvancedSettings.vue";
import DetectionsSection from "@/components/settings/configurations/DetectionsSection.vue";
import DetectionFineTuningSection from "@/components/settings/configurations/DetectionFineTuningSection.vue";
import HomeNetworkSection from "@/components/settings/configurations/HomeNetworkSection.vue";
import NotificationsSection from "@/components/settings/configurations/NotificationsSection.vue";
import ProcessesSection from "@/components/settings/configurations/ProcessesSection.vue";
import ProcessingSection from "@/components/settings/configurations/ProcessingSection.vue";
import DiscoverySection from "@/components/settings/configurations/DiscoverySection.vue";
import FilteringSection from "@/components/settings/configurations/FilteringSection.vue";
import HomelabIDSCollaborationSection from "@/components/settings/configurations/HomelabIDSCollaborationSection.vue";
import { getConfigurations, updateConfiguration } from "@/services/settings";
import type {
  ConfigurationDefinition,
  ConfigurationSetting,
  ConfigurationResponse,
  ConfigurationApiItem,
} from "@/types/configurations";

const activeTab = ref("general");

// Reactive data for configurations
const configurations = ref<ConfigurationResponse>({});
const loading = ref(true);
const updatingConfigs = ref<Record<string, boolean>>({});
const showSaveNotification = ref(false);
const saveNotificationMessage = ref("");
const saveNotificationColor = ref("success");

// Configuration definitions based on your specifications
const configurationDefinitions: ConfigurationDefinition[] = [
  // Detections
  {
    category: "Detections",
    displayName: "New Hosts Detection",
    type: "INT",
    key: "NewHostsDetection",
  },
  {
    category: "Detections",
    displayName: "Local Flows Detection",
    type: "INT",
    key: "LocalFlowsDetection",
  },
  {
    category: "Detections",
    displayName: "Router Flows Detection",
    type: "INT",
    key: "RouterFlowsDetection",
  },
  {
    category: "Detections",
    displayName: "Foreign Flows Detection",
    type: "INT",
    key: "ForeignFlowsDetection",
  },
  {
    category: "Detections",
    displayName: "New Outbound Detection",
    type: "INT",
    key: "NewOutboundDetection",
  },
  {
    category: "Detections",
    displayName: "Dead Connection Detection (TCP)",
    type: "INT",
    key: "DeadConnectionDetection",
  },
  {
    category: "Detections",
    displayName: "Bypass Local DNS Detection",
    type: "INT",
    key: "BypassLocalDnsDetection",
  },
  {
    category: "Detections",
    displayName: "Bypass Local NTP Detection",
    type: "INT",
    key: "BypassLocalNtpDetection",
  },
  {
    category: "Detections",
    displayName: "Banned Country List Detection",
    type: "INT",
    key: "GeolocationFlowsDetection",
  },
  {
    category: "Detections",
    displayName: "Incorrect Authoritative DNS Detection",
    type: "INT",
    key: "IncorrectAuthoritativeDnsDetection",
  },
  {
    category: "Detections",
    displayName: "Incorrect NTP Stratum Detection",
    type: "INT",
    key: "IncorrectNtpStratrumDetection",
  },
  {
    category: "Detections",
    displayName: "High Risk Port Detection",
    type: "INT",
    key: "HighRiskPortDetection",
  },
  {
    category: "Detections",
    displayName: "Reputation List Detection",
    type: "INT",
    key: "ReputationListDetection",
  },
  {
    category: "Detections",
    displayName: "VPN Traffic Detection",
    type: "INT",
    key: "VpnTrafficDetection",
  },
  {
    category: "Detections",
    displayName: "Port Scanning Detection",
    type: "INT",
    key: "PortScanDetection",
  },
  {
    category: "Detections",
    displayName: "Many Destinations Detection",
    type: "INT",
    key: "ManyDestinationsDetection",
  },
  {
    category: "Detections",
    displayName: "High Bandwidth Flow Detection",
    type: "INT",
    key: "HighBandwidthFlowDetection",
  },
  {
    category: "Detections",
    displayName: "Tor Flow Detection",
    type: "INT",
    key: "TorFlowDetection",
  },
  {
    category: "Detections",
    displayName: "Alert On Custom Tags",
    type: "INT",
    key: "AlertOnCustomTags",
  },

  // Detection Fine Tuning
  {
    category: "Detection Fine Tuning",
    displayName: "Banned Country List",
    type: "Text/String",
    key: "BannedCountryList",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved Local NTP Server List",
    type: "Text/String",
    key: "ApprovedLocalNtpServersList",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved Local DNS Server List",
    type: "Text/String",
    key: "ApprovedLocalDnsServersList",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved Local NTP Servers",
    type: "Text/String",
    key: "ApprovedNtpStratumServersList",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved Local DNS Servers List",
    type: "Text/String",
    key: "ApprovedAuthoritativeDnsServersList",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved VPN Endpoints",
    type: "Text/String",
    key: "ApprovedVpnServersList",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Max Mind API Key",
    type: "Text/String",
    key: "MaxMindAPIKey",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "High Risk Port List",
    type: "Text/String",
    key: "HighRiskPorts",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Alert On Custom Tags List",
    type: "Text/String",
    key: "AlertOnCustomTagList",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Scanning Maximum Unique Destinations",
    type: "Text/Int",
    key: "MaxUniqueDestinations",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Scanning: Maximum Ports Per Destination",
    type: "Text/Int",
    key: "MaxPortsPerDestination",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Tor Nodes Download URL",
    type: "Text/String",
    key: "TorNodesUrl",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "High Bandwidth Max Packets",
    type: "Text/Int",
    key: "MaxPackets",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "High Bandwidth Max Bytes",
    type: "Text/Int",
    key: "MaxBytes",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved High Risk Destinations",
    type: "Text/String",
    key: "ApprovedHighRiskDestinations",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Reputation List Remove",
    type: "Text/String",
    key: "ReputationListRemove",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Reputation URL",
    type: "Text/String",
    key: "ReputationUrl",
  },

  // Home Network
  {
    category: "Home Network",
    displayName: "Local Networks",
    type: "Text Input",
    key: "LocalNetworks",
  },
  {
    category: "Home Network",
    displayName: "Router IP Address",
    type: "Text Input",
    key: "RouterIpAddresses",
  },

  // Notifications
  {
    category: "Notifications",
    displayName: "Telegram Enabled",
    type: "Boolean/Toggle",
    key: "TelegramEnabled",
  },
  {
    category: "Notifications",
    displayName: "Telegram Bot Token",
    type: "Text Input",
    key: "TelegramBotToken",
  },
  {
    category: "Notifications",
    displayName: "Telegram Chat Id",
    type: "Text Input",
    key: "TelegramChatId",
  },

  // Processes
  {
    category: "Processes",
    displayName: "Local Device Discovery",
    type: "Boolean/Toggle",
    key: "EnableLocalDiscoveryProcess",
  },
  {
    category: "Processes",
    displayName: "Netflow Collector",
    type: "Boolean/Toggle",
    key: "StartCollector",
  },
  {
    category: "Processes",
    displayName: "Detection Engine",
    type: "Boolean/Toggle",
    key: "ScheduleProcessor",
  },
  {
    category: "Processes",
    displayName: "Sink Hole DNS Server",
    type: "Boolean/Toggle",
    key: "SinkHoleDns",
  },
  {
    category: "Processes",
    displayName: "Perform DNS Lookups on DNS Logs for Investigations",
    type: "Boolean/Toggle",
    key: "PerformDnsResponseLookupsForInvestigations",
  },

  // Processing
  {
    category: "Processing",
    displayName: "Clean New Flows After Processing",
    type: "Boolean/Toggle",
    key: "CleanNewFlows",
  },
  {
    category: "Processing",
    displayName: "Discovery Run Frequency",
    type: "Text/Int",
    key: "DiscoveryProcessRunInterval",
  },
  {
    category: "Processing",
    displayName: "Collector Processing Interval",
    type: "Text/Int",
    key: "CollectorProcessingInterval",
  },
  {
    category: "Processing",
    displayName: "Detection Run Interval",
    type: "Text/Int",
    key: "ProcessRunInterval",
  },
  {
    category: "Processing",
    displayName: "Integrations Fetch Interval",
    type: "Text/Int",
    key: "IntegrationFetchInterval",
  },
  {
    category: "Processing",
    displayName: "Pihole DNS Fetch Interval",
    type: "Text/Int",
    key: "PiHoleDnsFetchInterval",
  },
  {
    category: "Processing",
    displayName: "Pihole DNS Fetch Record Size",
    type: "Text/Int",
    key: "PiHoleDnsFetchRecordSize",
  },
  {
    category: "Processing",
    displayName: "DNS Response Lookup DNS Servers",
    type: "Text/String",
    key: "DnsResponseLookupResolver",
  },
  {
    category: "Processing",
    displayName: "Traffic Stats Purge Interval",
    type: "Text/Int",
    key: "TrafficStatsPurgeIntervalDays",
  },
  {
    category: "Processing",
    displayName: "Import ASN Database",
    type: "Boolean/Toggle",
    key: "ImportAsnDatabase",
  },

  // Discovery
  {
    category: "Discovery",
    displayName: "NMAP OS Fingerprinting",
    type: "Boolean/Toggle",
    key: "DiscoveryNmapOsFingerprint",
  },
  {
    category: "Discovery",
    displayName: "DNS Resolver Timeout",
    type: "Text/Int",
    key: "DnsResolverTimeout",
  },
  {
    category: "Discovery",
    displayName: "DNS Resolver Retries",
    type: "Text/Int",
    key: "DnsResolverRetries",
  },
  {
    category: "Discovery",
    displayName: "PiHole URL",
    type: "Text/String",
    key: "PiholeUrl",
  },
  {
    category: "Discovery",
    displayName: "PiHole API Key",
    type: "Text/String",
    key: "PiholeApiKey",
  },
  {
    category: "Discovery",
    displayName: "Reverse DNS Lookup",
    type: "Boolean/Toggle",
    key: "DiscoveryReverseDns",
  },
  {
    category: "Discovery",
    displayName: "PiHole DHCP Lookup",
    type: "Boolean/Toggle",
    key: "DiscoveryPiholeDhcp",
  },
  {
    category: "Discovery",
    displayName: "Store Pihole DNS Query History",
    type: "Boolean/Toggle",
    key: "StorePiHoleDnsQueryHistory",
  },
  {
    category: "Discovery",
    displayName: "Import Port Mapping List",
    type: "Boolean/Toggle",
    key: "ImportServicesList",
  },

  // Filtering
  {
    category: "Filtering",
    displayName: "Remove Broadcast Flows",
    type: "Boolean/Toggle",
    key: "RemoveBroadcastFlows",
  },
  {
    category: "Filtering",
    displayName: "Remove Multicast Flows",
    type: "Boolean/Toggle",
    key: "RemoveMulticastFlows",
  },
  {
    category: "Filtering",
    displayName: "Remove Link Local Flows",
    type: "Boolean/Toggle",
    key: "RemoveLinkLocalFlows",
  },

  // HomelabIDS Collaboration
  {
    category: "HomelabIDS Collaboration",
    displayName: "Send Errors to Cloud API",
    type: "Boolean/Toggle",
    key: "SendErrorsToCloudApi",
  },
  {
    category: "HomelabIDS Collaboration",
    displayName: "Send Device Classifications to Cloud API",
    type: "Boolean/Toggle",
    key: "SendDeviceClassificationsToHomelabApi",
  },
  {
    category: "HomelabIDS Collaboration",
    displayName: "Send Configuration To Cloud API",
    type: "Boolean/Toggle",
    key: "SendConfigurationToCloudApi",
  },
];

// Transform API array to object format
const transformApiData = (
  apiData: ConfigurationApiItem[]
): ConfigurationResponse => {
  const transformed: ConfigurationResponse = {};
  apiData.forEach((item) => {
    transformed[item.key] = item.value;
  });
  return transformed;
};

// Computed property to group configurations by category
const groupedConfigurations = computed(() => {
  const grouped: Record<string, ConfigurationSetting[]> = {};

  configurationDefinitions.forEach((def) => {
    if (!grouped[def.category]) {
      grouped[def.category] = [];
    }

    const configValue = configurations.value[def.key];
    const setting: ConfigurationSetting = {
      ...def,
      value: def.type === "INT" ? undefined : configValue,
      // For detection INT settings, break down the value into checkbox states
      alert: def.type === "INT" ? configValue >= 1 : false,
      notify: def.type === "INT" ? configValue >= 2 : false,
      reNotify: def.type === "INT" ? configValue >= 3 : false,
    };

    grouped[def.category].push(setting);
  });

  return grouped;
});

// Fetch configurations from API
const fetchConfigurations = async () => {
  try {
    loading.value = true;
    const { data } = await getConfigurations();
    // Transform array format to object format
    configurations.value = transformApiData(data);
  } catch (error) {
    console.error("Error fetching configurations:", error);
    showNotification("Error fetching configurations", "error");
  } finally {
    loading.value = false;
  }
};

// Update detection value (checkbox logic)
const updateDetectionValue = async (setting: ConfigurationSetting) => {
  try {
    updatingConfigs.value[setting.key] = true;

    let newValue = 0;
    if (setting.alert) newValue += 1;
    if (setting.notify) newValue += 1;
    if (setting.reNotify) newValue += 1;

    await updateConfigurationValue({ ...setting, value: newValue });
  } finally {
    updatingConfigs.value[setting.key] = false;
  }
};

// Update configuration value
const updateConfigurationValue = async (setting: ConfigurationSetting) => {
  try {
    updatingConfigs.value[setting.key] = true;

    const configUpdate = {
      key: setting.key,
      value: setting.value,
    };

    await updateConfiguration(configUpdate);
    configurations.value[setting.key] = setting.value;
    showNotification("Configuration updated successfully", "success");
  } catch (error) {
    console.error("Error updating configuration:", error);
    showNotification("Error updating configuration", "error");
  } finally {
    updatingConfigs.value[setting.key] = false;
  }
};

// Show notification
const showNotification = (message: string, color: string) => {
  saveNotificationMessage.value = message;
  saveNotificationColor.value = color;
  showSaveNotification.value = true;
};

onMounted(() => {
  console.log("Settings view mounted");
  fetchConfigurations();
});
</script>

<style scoped>
.settings-container {
  height: 100%;
}
</style>
