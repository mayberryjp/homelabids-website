<template>
  <v-sheet class="settings-container" color="#0d1117">
    <v-row no-gutters>
      <!-- Left side tabs -->
      <v-col cols="12" sm="2">
        <v-tabs v-model="activeTab" direction="vertical" color="primary">
          <v-tab value="general">General</v-tab>
          <v-tab value="notifications">Notifications</v-tab>
          <v-tab value="security">Security</v-tab>
          <v-tab value="api">API Keys</v-tab>
          <v-tab value="advanced">Advanced</v-tab>
          <v-tab value="configurations">Configurations</v-tab>
        </v-tabs>
      </v-col>

      <!-- Right side content -->
      <v-col cols="12" sm="10">
        <v-card-text>
          <v-window v-model="activeTab">
            <!-- General Settings -->
            <v-window-item value="general">
              <h3>General Settings</h3>
              <v-divider class="my-4"></v-divider>

              <v-form>
                <v-text-field
                  label="Display Name"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>

                <v-select
                  label="Time Zone"
                  :items="['UTC', 'UTC-5 (EST)', 'UTC+1 (CET)', 'UTC+9 (JST)']"
                  variant="outlined"
                  density="comfortable"
                ></v-select>

                <v-switch
                  label="Dark Mode"
                  color="primary"
                  hide-details
                  class="my-4"
                ></v-switch>
              </v-form>
            </v-window-item>

            <!-- Notifications Settings -->
            <v-window-item value="notifications">
              <h3>Notifications</h3>
              <v-divider class="my-4"></v-divider>

              <v-switch
                label="Email Notifications"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                label="Push Notifications"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>
            </v-window-item>

            <!-- Security Settings -->
            <v-window-item value="security">
              <h3>Security</h3>
              <v-divider class="my-4"></v-divider>

              <v-btn color="primary" class="mb-4">Change Password</v-btn>

              <div class="mt-4">
                <h4 class="text-subtitle-1">Two-Factor Authentication</h4>
                <v-switch
                  label="Enable 2FA"
                  color="primary"
                  hide-details
                ></v-switch>
              </div>
            </v-window-item>

            <!-- API Settings -->
            <v-window-item value="api">
              <h3>API Keys</h3>
              <v-divider class="my-4"></v-divider>

              <v-text-field
                label="API Key"
                variant="outlined"
                readonly
                append-inner-icon="mdi-content-copy"
                density="comfortable"
              ></v-text-field>

              <v-btn color="primary" class="mt-2">Generate New Key</v-btn>
            </v-window-item>

            <!-- Advanced Settings -->
            <v-window-item value="advanced">
              <h3>Advanced Settings</h3>
              <v-divider class="my-4"></v-divider>

              <advanced-settings></advanced-settings>
            </v-window-item>

            <!-- Configurations Settings -->
            <v-window-item value="configurations">
              <h3>Configurations</h3>
              <v-divider class="my-4"></v-divider>
              <configurations />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AdvancedSettings from "@/components/settings/AdvancedSettings.vue";
import Configurations from "@/components/settings/Configurations.vue";

const activeTab = ref("general");
</script>

<style scoped>
.settings-container {
  height: 100%;
}
</style>
