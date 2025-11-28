<template>
  <v-sheet class="settings-container" color="#0d1117">
    <v-row no-gutters>
      <!-- Left side tabs -->
      <v-col cols="12" sm="3">
        <v-tabs v-model="activeTab" direction="vertical" color="primary">
          <!-- Configuration tabs -->
          <v-tab value="home-network">Home Network</v-tab>
          <v-tab value="other-networks">Other Networks</v-tab>
          <v-tab value="processes">Processes</v-tab>
          <v-tab value="processing">Processing</v-tab>
          <v-tab value="detections">Detections</v-tab>
          <v-tab value="detection-fine-tuning">Detection Fine Tuning</v-tab>

          <v-tab value="config-notifications">Notifications Config</v-tab>

          <v-tab value="discovery">Discovery</v-tab>
          <v-tab value="filtering">Filtering</v-tab>
          <v-tab value="homelab-ids">Collaboration</v-tab>
          <!-- Advanced -->
          <v-tab value="advanced">Advanced</v-tab>
        </v-tabs>
      </v-col>

      <!-- Right side content -->
      <v-col cols="12" sm="9">
        <v-card-text>
          <v-window v-model="activeTab">
            <!-- Configuration Tabs -->
            <!-- Home Network Settings -->
            <v-window-item value="home-network">
              <h3>Home Network</h3>
              <v-divider class="my-4"></v-divider>
              <LocalNetworksConfig />
              <!-- Optionally keep the old section below -->
              <!-- <home-network-section ... /> -->
            </v-window-item>

            <!-- Other Networks -->

            <v-window-item value="other-networks">
              <h3>Other Networks</h3>
              <v-divider class="my-4"></v-divider>
              <home-network-section
                v-if="groupedConfigurations['Other Networks']"
                :settings="groupedConfigurations['Other Networks']"
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
              <h3>Collaboration</h3>
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
import LocalNetworksConfig from "@/components/settings/configurations/LocalNetworksConfig.vue";
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
import { useNotificationStore } from "@/stores/notification";

const activeTab = ref("home-network");

// Reactive data for configurations
const configurations = ref<ConfigurationResponse>({});
const loading = ref(true);
const updatingConfigs = ref<Record<string, boolean>>({});

// Initialize notification store
const notificationStore = useNotificationStore();

// Configuration definitions based on your specifications
const configurationDefinitions: ConfigurationDefinition[] = [
  // Detections
  {
    category: "Detections",
    displayName: "New Hosts Detection",
    type: "INT",
    key: "NewHostsDetection",
    details: "Detects new hosts on the network when they first initiate network traffic. ",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Local Flows Detection",
    type: "INT",
    key: "LocalFlowsDetection",
    details: "Detects local traffic flows that pass through the netflow source (firewall/router) which should normally just stay on the local network and may identifiy a misconfiguration. ",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Router Flows Detection",
    type: "INT",
    key: "RouterFlowsDetection",
    details: "Detects traffic flows directly at the netflow source (firewall/router) which may be indicative of misconfigurations or unusual traffic patterns or identify a security issue.",
    default: "Disabled",
    suggested: "Disabled",
  },
  {
    category: "Detections",
    displayName: "Foreign Flows Detection",
    type: "INT",
    key: "ForeignFlowsDetection",
    details: "Detects traffic from two non-local sources that are passing through the netflow source (firewall/router) which may be indicative of misconfigurations or unusual traffic patterns or the need to add additional local networks to the site configuration.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "New Outbound Detection",
    type: "INT",
    key: "NewOutboundDetection",
    details: "Detects new outbound connections initiated by hosts on the network. This helps identify new external communications.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Dead Connection Detection (TCP)",
    type: "INT",
    key: "DeadConnectionDetection",
    details: "Detects TCP connections that don't receive a response after a certain period, indicating potential mis-configuration.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Bypass Local DNS Detection",
    type: "INT",
    key: "BypassLocalDnsDetection",
    details: "Detects DNS queries that bypass the local DNS server, which may indicate misconfiguration or attempts to evade local DNS policies.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Bypass Local NTP Detection",
    type: "INT",
    key: "BypassLocalNtpDetection",
    details: "Detects NTP requests that bypass the local NTP server, which may indicate misconfiguration or attempts to evade local NTP policies.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Banned Country List Detection",
    type: "INT",
    key: "GeolocationFlowsDetection",
    details: "Detects traffic to or from countries that are on the banned country list, which may indicate potential current or future security risks.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Incorrect Authoritative DNS Detection",
    type: "INT",
    key: "IncorrectAuthoritativeDnsDetection",
    details: "Detects DNS queries from the local DNS servers that are directed at unintended external DNS servers",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Incorrect NTP Stratum Detection",
    type: "INT",
    key: "IncorrectNtpStratrumDetection",
    details: "Detects NTP requests from the local NTP servers that are directed at unintended external NTP servers",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "High Risk Port Detection",
    type: "INT",
    key: "HighRiskPortDetection",
    details: "Detects traffic to or from high-risk ports that can be used for malware or data exfiltration.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Reputation List Detection",
    type: "INT",
    key: "ReputationListDetection",
    details: "Detects traffic to or from IP addresses that are on a reputation list and are known to be associated with malicious activity.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "VPN Traffic Detection",
    type: "INT",
    key: "VpnTrafficDetection",
    details: "Detects traffic that is likely to be VPN traffic, which may indicate attempts to bypass local network policies.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Port Scanning Detection",
    type: "INT",
    key: "PortScanDetection",
    details: "Detects port scanning activities that may indicate an attempt to find vulnerabilities in the network or hosts that are infected with malware.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Many Destinations Detection",
    type: "INT",
    key: "ManyDestinationsDetection",
    details: "Detects traffic that is sent to many different destinations, which may indicate scanning or other suspicious activity.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "High Bandwidth Flow Detection",
    type: "INT",
    key: "HighBandwidthFlowDetection",
    details: "Detects flows that exceed a certain threshold of packets or bytes, which may indicate data exfiltration or other suspicious activity.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Detections",
    displayName: "Tor Flow Detection",
    type: "INT",
    key: "TorFlowDetection",
    details: "Detects traffic that is likely to be Tor traffic, which may indicate attempts to bypass local network policies.",
    default: "Enabled",
    suggested: "Enabled",
  },

  // Detection Fine Tuning
  {
    category: "Detection Fine Tuning",
    displayName: "Banned Country List",
    type: "Text/String",
    key: "BannedCountryList",
    details: "List of countries that are banned from accessing the network. This is a comma separated list of country names.",
    default: "China,North Korea,Iran,Russia,Ukraine,Georgia,Armenia,Azerbaijan,Belarus,Syria,Venezuela,Cuba,Myanmar,Afghanistan",
    suggested: "At the discretion of the user, based on their network security policies.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Additional NTP Server List",
    type: "Text/String",
    key: "ApprovedLocalNtpServersList",
    details: "List of additional approved NTP servers n your network. NTP servers from scopes will be added automatically in detections. This is a comma separated list of IP addresses where your network devices should get time.",
    default: "",
    suggested: "At the discretion of the user, based on their network configuration.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Additional DNS Server List",
    type: "Text/String",
    key: "ApprovedLocalDnsServersList",
    details: "List of additional approved DNS servers in your network. DNS servers from scopes will be added automaticaly in detections. This is a comma separated list of IP addresses where your network devices should resolve DNS queries.",
    default: "",
    suggested: "At the discretion of the user, based on their network configuration.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved Internet NTP Stratum Servers List",
    type: "Text/String",
    key: "ApprovedNtpStratumServersList",
    details: "List of approved NTP stratum servers on the Internet. This is a comma separated list of IP addresses that your local NTP servers should use to synchronize time.",
    default: "",
    suggested: "At the discretion of the user, based on their network configuration.", 
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved Local DNS Servers List",
    type: "Text/String",
    key: "ApprovedAuthoritativeDnsServersList",
    details: "List of approved DNS authoritative servers on the Internet. This is a comma separated list of IP addresses where your local DNS servers should resolve DNS queries.",
    default: "",
    suggested: "At the discretion of the user, based on their network configuration.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved VPN Endpoints",
    type: "Text/String",
    key: "ApprovedVpnServersList",
    details: "List of approved VPN endpoints on the Internet that your hosts may connect to. This is a comma separated list of IP addresses that your network devices should use to connect to VPN services.",
    default: "",
    suggested: "At the discretion of the user, based on their network configuration.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Max Mind API Key",
    type: "Text/String",
    key: "MaxMindAPIKey",
    details: "API key for Max Mind GeoIP service to resolve IP addresses to geolocations. This is required for geolocation based detections. Keys can be onbtained for free at https://www.maxmind.com/en/geoip2-precision-services",
    default: "", 
    suggested: "Obtain your own Max Mind API key for geolocation lookups.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "High Risk Port List",
    type: "Text/String",
    key: "HighRiskPorts",
    details: "List of ports that you consider high risk. This is a comma separated list of port numbers that are commonly used for malicious activity or data exfiltration.",
    default: "135,137,138,139,445,25,587,22,23,3389",
    suggested: "At the discretion of the user, based on their network security policies.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Scanning Maximum Unique Destinations",
    type: "Text/Int",
    key: "MaxUniqueDestinations",
    details: "Maximum number of unique destinations that a local host can communicate with within a given time frame. This is used to detect port scanning activities.",
    default: "30",
    suggested: "At the discretion of the user, based on their network security policies.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Scanning: Maximum Ports Per Destination",
    type: "Text/Int",
    key: "MaxPortsPerDestination",
    details: "Maximum number of ports that a local host can communicate with on a single destination within a given time frame. This is used to detect port scanning activities.",
    default: "15",
    suggested: "At the discretion of the user, based on their network security policies.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Tor Nodes Download URL",
    type: "Text/String",
    key: "TorNodesUrl",
    details: "URL to download the latest Tor nodes list. This is used to detect Tor traffic on the network.",
    default: "https://www.dan.me.uk/torlist/?full",
    suggested: "https://www.dan.me.uk/torlist/?full",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "High Bandwidth Max Packets",
    type: "Text/Int",
    key: "MaxPackets",
    details: "Maximum number of packets that can be sent within a time window to trigger high bandwidth alerts.",
    default: "30000",
    suggested: "At the discretion of the user, based on their network traffic patterns.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "High Bandwidth Max Bytes",
    type: "Text/Int",
    key: "MaxBytes",
    details: "Maximum number of bytes that can be sent within a time window to trigger high bandwidth alerts.",
    default: "3000000",
    suggested: "At the discretion of the user, based on their network traffic patterns.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Approved High Risk Destinations",
    type: "Text/String",
    key: "ApprovedHighRiskDestinations",
    details: "List of approved high risk destinations that are excluded from high risk port detection. This is a comma separated list of IP addresses that are known to be used for legitimate purposes but may use high risk ports.",
    default: "",
    suggested: "At the discretion of the user, based on their network security policies.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Reputation List Remove",
    type: "Text/String",
    key: "ReputationListRemove",
    details: "List of IP addresses that should be removed from the reputation list when it's imported. This is a comma separated list of IP addresses that you want to exclude from reputation based detections.",
    default: "192.168.0.0/16,0.0.0.0/8,224.0.0.0/3,169.254.0.0/16",
    suggested: "At the discretion of the user, based on their network security policies.",
  },
  {
    category: "Detection Fine Tuning",
    displayName: "Reputation URL",
    type: "Text/String",
    key: "ReputationUrl",
    details: "URL to the reputation list that should be used for detection. This is the location where the reputation list can be downloaded from.",
    default: "https://iplists.firehol.org/files/firehol_level1.netset",
    suggested: "https://iplists.firehol.org/files/firehol_level1.netset",
  },
  // Home Network
  {
    category: "Home Network",
    displayName: "Local Networks",
    type: "Text Input",
    key: "LocalNetworks",
    details: "List of local networks in CIDR format (e.g., 192.168.1.0/24). This is used to identify local devices on your network. Multiple networks can be specified as a comma separated list.",
    default: "",
    suggested: "At the discretion of the user, based on their network configuration.",
  },
  {
    category: "Home Network",
    displayName: "Additional Router IP Addresses",
    type: "Text Input",
    key: "RouterIpAddresses",
    details: "Additional IP address of your router or firewall that is used to collect netflow data. Router IP Addresses from scopes will be added automatically. This is used to identify the source of network traffic. Multiple IP addresses can be specified as a comma separated list.",
    default: "",
    suggested: "At the discretion of the user, based on their network configuration.",
  },
  // Notifications
  {
    category: "Notifications",
    displayName: "Telegram Enabled",
    type: "Boolean/Toggle",
    key: "TelegramEnabled",
    details: "Enable or disable Telegram notifications for alerts and events.",
    default: "Disabled",
    suggested: "At user's discretion, based on their notification preferences.",
  },
  {
    category: "Notifications",
    displayName: "Telegram Bot Token",
    type: "Text Input",
    key: "TelegramBotToken",
    details: "Bot token for the Telegram bot used to send notifications. This is required to authenticate the bot with the Telegram API.",
    default: "",
    suggested: "Obtain your own Telegram bot token from BotFather on Telegram.",
  },
  {
    category: "Notifications",
    displayName: "Telegram Chat Id",
    type: "Text Input",
    key: "TelegramChatId",
    details: "Chat ID for the Telegram chat where notifications will be sent. This is required to specify the target chat for the bot.",
    default: "",
    suggested: "Obtain your own Telegram chat ID from the Telegram app.",
  },
  // Processes
  {
    category: "Processes",
    displayName: "Local Device Discovery",
    type: "Boolean/Toggle",
    key: "EnableLocalDiscoveryProcess",
    details: "Enable or disable the local device discovery process that identifies devices on the network and information about them.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Processes",
    displayName: "Netflow Collector",
    type: "Boolean/Toggle",
    key: "StartCollector",
    details: "Enable or disable the netflow collector process that collects network traffic data from the router or firewall.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Processes",
    displayName: "Detection Engine",
    type: "Boolean/Toggle",
    key: "ScheduleProcessor",
    details: "Enable or disable the detection engine process that analyzes network traffic for suspicious activity.",
    default: "Enabled",
    suggested: "Enabled",
  },
    {
    category: "Processes",
    displayName: "DHCP Server",
    type: "Boolean/Toggle",
    key: "DhcpServer",
    details: "Enable or disable the DHCP Server that can be used for assigning IP addresses to local hosts on your network. You must define local network scopes for every network you want to serve. DHCP Relay is supported. Do not use this if another DHCP server operates on this host. DHCP responses will only be given for known registered hosts.",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "Processes",
    displayName: "Sink Hole DNS Server",
    type: "Boolean/Toggle",
    key: "SinkHoleDns",
    details: "Enable or disable the sink hole DNS server that can be used for denying DNS queries to local hosts that you don't want to have network traffic. You must configure your DHCP server to selectively give hosts this DNS server. Do not use this if another DNS server operates on this host.",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "Processes",
    displayName: "Perform DNS Lookups on DNS Logs for Investigations",
    type: "Boolean/Toggle",
    key: "PerformDnsResponseLookupsForInvestigations",
    details: "Perform DNS lookups for domains that your hosts query in order to resolve them to IP addresses for investigations.",
    default: "Enabled",
    suggested: "Enabled",
  },

  // Processing
  {
    category: "Processing",
    displayName: "Clean New Flows After Processing",
    type: "Boolean/Toggle",
    key: "CleanNewFlows",
    details: "Enable or disable the cleaning of new flows after processing. You may choose to not clean flows for debugging purposes. Under normal operation, this should be enabled.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Processing",
    displayName: "Discovery Run Frequency",
    type: "Text/Int",
    key: "DiscoveryProcessRunInterval",
    details: "Frequency in seconds at which the local device discovery process runs to collect more information about local network devices.",
    default: "28800",
    suggested: "28800 (8 hours)",
  },
  {
    category: "Processing",
    displayName: "Collector Processing Interval",
    type: "Text/Int",
    key: "CollectorProcessingInterval",
    details: "Frequency in seconds at which the netflow collector process runs to process collected network traffic data.",
    default: "60",
    suggested: "60 seconds (1 minute). It should match the netflow export interval configured on your router or firewall.",
  },
  {
    category: "Processing",
    displayName: "Detection Run Interval",
    type: "Text/Int",
    key: "ProcessRunInterval",
    details: "Frequency in seconds at which the detection engine process runs to analyze network traffic for suspicious activity.",
    default: "60",
    suggested: "60 seconds (1 minute). It should match the netflow export interval configured on your router or firewall.",
  },
  {
    category: "Processing",
    displayName: "Integrations Fetch Interval",
    type: "Text/Int",
    key: "IntegrationFetchInterval",
    details: "Frequency in seconds at which the integrations fetch process runs to collect data from external services like PiHole.",
    default: "86400",
    suggested: "86400 (24 hours)",
  },
  {
    category: "Processing",
    displayName: "Pihole DNS Fetch Interval",
    type: "Text/Int",
    key: "PiHoleDnsFetchInterval",
    details: "Frequency in seconds at which the PiHole DNS fetch process runs to store what DNS queries the hosts on your network are making.",
    default: "3600",
    suggested: "3600 (1 hour)",
  },
  {
    category: "Processing",
    displayName: "Pihole DNS Fetch Record Size",
    type: "Text/Int",
    key: "PiHoleDnsFetchRecordSize",
    details: "Number of DNS records to fetch from PiHole in each request. This is used to limit the amount of data fetched in each request.",
    default: "10000",
    suggested: "Depends on the volume of DNS queries in your network within a given time frame. 10000 is a good starting point.",
  },
  {
    category: "Processing",
    displayName: "DNS Response Lookup DNS Servers",
    type: "Text/String",
    key: "DnsResponseLookupResolver",
    details: "Comma separated list of DNS servers to use for performing DNS lookups on DNS responses. This is used to resolve domains that your hosts query in order to investigate them.",
    default: "",
    suggested: "Use internet DNS servers because they can handle greater load. For example: 8.8.8.8,8.8.4.4",
  },
  {
    category: "Processing",
    displayName: "Traffic Stats Purge Interval",
    type: "Text/Int",
    key: "TrafficStatsPurgeIntervalDays",
    details: "Frequency in days at which the traffic stats are purged from the database. This is used to keep the database size manageable.",
    default: "31",
    suggested: "31 days (1 month). This is a good starting point, but you can adjust it based on your storage capacity and retention policies.",
  },
  {
    category: "Processing",
    displayName: "Import ASN Database",
    type: "Boolean/Toggle",
    key: "ImportAsnDatabase",
    details: "Whether the ASN database should be imported into the system. This is used to resolve IP Addresses to ISP names for investigations.",
    default: "Enabled",
    suggested: "Enabled",
  },
  // Discovery
  {
    category: "Discovery",
    displayName: "NMAP OS Fingerprinting",
    type: "Boolean/Toggle",
    key: "DiscoveryNmapOsFingerprint",
    details: "Enable or disable NMAP OS fingerprinting for local device discovery. This helps identify the operating system of devices on the network.",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "Discovery",
    displayName: "DNS Resolver Timeout",
    type: "Text/Int",
    key: "DnsResolverTimeout",
    details: "Timeout in seconds for DNS resolver queries. This is used to determine how long to wait for a DNS response before timing out.",
    default: "3",
    suggested: "3",
  },
  {
    category: "Discovery",
    displayName: "DNS Resolver Retries",
    type: "Text/Int",
    key: "DnsResolverRetries",
    details: "Number of retries for DNS resolver queries. This is used to determine how many times to retry a DNS query before giving up.",
    default: "1",
    suggested: "1",
  },
  {
    category: "Discovery",
    displayName: "PiHole URL",
    type: "Text/String",
    key: "PiholeUrl",
    details: "URL of the PiHole instance to fetch DNS query history and other data from. This is used to integrate with PiHole for DNS query history.",
    default: "",
    suggested: "http://pihole.local/api",
  },
  {
    category: "Discovery",
    displayName: "PiHole API Key",
    type: "Text/String",
    key: "PiholeApiKey",
    details: "API key for the PiHole instance to authenticate requests. This is required to access the PiHole API.",
    default: "",
    suggested: "Your PiHole API key from your local pihole instance",
  },
  {
    category: "Discovery",
    displayName: "Reverse DNS Lookup",
    type: "Boolean/Toggle",
    key: "DiscoveryReverseDns",
    details: "Enable or disable reverse DNS lookups for local device discovery. This helps identify the hostnames of devices on your local network.",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "Discovery",
    displayName: "PiHole DHCP Lookup",
    type: "Boolean/Toggle",
    key: "DiscoveryPiholeDhcp",
    details: "Enable or disable the discovery of devices that are connected to the network via PiHole DHCP. This helps identify devices that are not directly connected to the router.",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "Discovery",
    displayName: "Store Pihole DNS Query History",
    type: "Boolean/Toggle",
    key: "StorePiHoleDnsQueryHistory",
    details: "Enable or disable the storage of PiHole DNS query history. This helps in tracking DNS queries made by devices on your network.",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "Discovery",
    displayName: "Import Port Mapping List",
    type: "Boolean/Toggle",
    key: "ImportServicesList",
    details: "Enable or disable the import of a port mapping list that maps common ports to service names. This helps in identifying services running on devices based on their open ports.",
    default: "Enabled",
    suggested: "Enabled",
  },

  // Filtering
  {
    category: "Filtering",
    displayName: "Remove Broadcast Flows",
    type: "Boolean/Toggle",
    key: "RemoveBroadcastFlows",
    details: "Enable or disable the removal of broadcast flows from the network traffic data prior to detection processing. This helps reduce noise in detections.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Filtering",
    displayName: "Remove Multicast Flows",
    type: "Boolean/Toggle",
    key: "RemoveMulticastFlows",
    details: "Enable or disable the removal of multicast flows from the network traffic data prior to detection processing. This helps reduce noise in detections.",
    default: "Enabled",
    suggested: "Enabled",
  },
  {
    category: "Filtering",
    displayName: "Remove Link Local Flows",
    type: "Boolean/Toggle",
    key: "RemoveLinkLocalFlows",
    details: "Enable or disable the removal of link-local flows (e.g: 169.254.0.0/16) from the network traffic data prior to detection processing. This helps reduce noise in detections.",
    default: "Enabled",
    suggested: "Enabled",
  },

  // HomelabIDS Collaboration
  {
    category: "HomelabIDS Collaboration",
    displayName: "Send Errors to Cloud API",
    type: "Boolean/Toggle",
    key: "SendErrorsToCloudApi",
    details: "Enable or disable sending error logs to the HomelabIDS cloud API so code owners can proactively triage bugs.",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "HomelabIDS Collaboration",
    displayName: "Send Device Classifications to Cloud API",
    type: "Boolean/Toggle",
    key: "SendDeviceClassificationsToHomelabApi",
    details: "Enable or disable sending device classifications to the HomelabIDS cloud API to help support auto-device classification data set.",
    default: "Disabled",
    suggested: "Enabled", 
  },
  {
    category: "HomelabIDS Collaboration",
    displayName: "Send Configuration To Cloud API",
    type: "Boolean/Toggle",
    key: "SendConfigurationToCloudApi",
    details: "Enable or disable sending configuration data to the HomelabIDS cloud API to help support the project feature investments and deployment decisions.",
    default: "Disabled",
    suggested: "Enabled",
  },
  {
    category: "HomelabIDS Collaboration",
    displayName: "Write Daily Logfile for Debugging",
    type: "Boolean/Toggle",
    key: "WriteLogFile",
    details: "Enable or disable writing a daily logfile for debugging purposes. Log file gets written to /database volume",
    default: "Disabled",
    suggested: "Disabled",
  },
  // OTHER NETWORKS
  {
    category: "Other Networks",
    displayName: "Other Networks",
    type: "Text Input",
    key: "OtherNetworks",
    details: "Key/value pairs of other private networks that you want to add geolocation data for. This is used to identify devices on other private networks that are not part of this SITE but may be parts of other SITES you manage.",
    default: "",
    suggested: "Other private networks that you want to add geolocation data for. Example input: FARM=192.168.1.0/24,VACATION_HOME=192.168.2.0/24",
  }
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
  if (color === 'success') {
    notificationStore.showSuccess(message);
  } else if (color === 'error') {
    notificationStore.showError(message);
  } else if (color === 'warning') {
    notificationStore.showWarning(message);
  } else {
    notificationStore.showNotification(message, color);
  }
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
