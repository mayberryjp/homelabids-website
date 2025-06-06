<template>
  <v-container class="pa-6">
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
// No script needed for static documentation
</script>