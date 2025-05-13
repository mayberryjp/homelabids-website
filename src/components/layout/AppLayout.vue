<template>
  <v-app>
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <v-row style="min-height: 100%">
          <!-- Left Panel -->
          <v-col cols="12" lg="3">
            <HostList />
          </v-col>

          <!-- Right Panel (Main Content) -->
          <v-col cols="12" lg="9">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import HostList from "@/components/dashboard/HostList.vue";
</script>

<style scoped>
.v-container {
  height: 100%;
}

.v-main {
  background-color: #0a0c10;
  color: rgba(255, 255, 255, 0.87);
}
</style>
