<template>
  <v-container class="pa-6">
    <v-card class="mb-6" color="#181c22" variant="tonal">
      <v-card-text>
        <div v-if="config">
          <div class="d-flex flex-wrap ga-4">
            <div class="configBubble"><strong>Site Name:</strong> {{ config.SiteName }}</div>
            <div class="configBubble"><strong>Version:</strong> {{ config.Version }}</div>
            <div class="configBubble"><strong>DB Schema:</strong> {{ config.DatabaseSchemaVersion }}</div>
            <div class="configBubble"><strong>Machine ID:</strong> {{ config.MachineUniqueIdentifier }}</div>
          </div>
        </div>
        <div v-else-if="configError" class="text-error">{{ configError }}</div>
        <div v-else>
          <v-progress-circular indeterminate size="20" color="primary" />
          <span class="ml-2">Loading configuration...</span>
        </div>
      </v-card-text>
    </v-card>

    <h1 class="text-h4 mb-4">Help & Documentation</h1>
    <v-divider class="mb-6"></v-divider>

    <v-expansion-panels multiple>
      <v-expansion-panel title="What is HomeLabIDS?">
        <v-expansion-panel-text>
          <p>
            <strong>HomeLabIDS</strong> is a web-based dashboard for monitoring and analyzing network flows and security alerts in your home or lab environment. It provides real-time visibility into network traffic, threat scores, and device activity.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Searching Flows">
        <v-expansion-panel-text>
          <ul>
            <li>You can search by <strong>IP address</strong>, <strong>port</strong>, <strong>Geolocation</strong>, <strong>ISP</strong>, <strong>Allowlist name</strong>, or <strong>DNS name</strong>.</li>
            <li>Only single-word, simple text searches are supported.</li>
            <li>Examples: <code>8.8.8.8</code>, <code>China</code>, <code>Amazon</code>, <code>example.com</code></li>
            <li>Most specific host details are provided (e.g., domain name, ISP, or country).</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Understanding the Dashboard">
        <v-expansion-panel-text>
          <ul>
            <li><strong>Data Explorer:</strong> View and search all network flows detected by the IDS.</li>
            <li><strong>Host Details:</strong> Click an IP address to see detailed info, threat score, tags, and traffic stats for a device.</li>
            <li><strong>Alert Bars:</strong> Visualize alert activity over time for each host.</li>
            <li><strong>Tags:</strong> Add custom tags to hosts for easier identification.</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Common Actions">
        <v-expansion-panel-text>
          <ul>
            <li><strong>Edit Host:</strong> Click the edit icon on a host detail page to update tags or allowlist status.</li>
            <li><strong>Refresh Data:</strong> Use the refresh button to reload the latest flows and alerts.</li>
            <li><strong>Settings:</strong> Access user and system settings from the profile menu.</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Troubleshooting">
        <v-expansion-panel-text>
          <ul>
            <li>If data is missing, try refreshing the page or check your network connection.</li>
            <li>For persistent issues, consult the browser console for errors or contact your system administrator.</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="About">
        <v-expansion-panel-text>
          <p>
            HomeLabIDS is an open-source project. For more information, visit the <a href="https://github.com/your-repo" target="_blank">GitHub repository</a>.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

type ConfigEntry = { key: string; value: string | number };

const configArray = ref<ConfigEntry[] | null>(null);
const config = ref<Record<string, string | number>>({});
const configError = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await api.get("/configurations");
    configArray.value = response.data;
    // Convert array to object for easy access
    config.value = Object.fromEntries(
      (configArray.value || []).map(item => [item.key, item.value])
    );
  } catch (e) {
    configError.value = "Could not load configuration.";
  }
});
</script>

<style scoped>
.configBubble {
  background: #1976d2;
  color: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  margin: 4px 8px 4px 0;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}
</style>