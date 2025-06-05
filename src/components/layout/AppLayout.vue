<template>
  <v-app>
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Only show HostList if not on explore route -->
          <v-col cols="12" lg="3" class="host-list-panel" v-if="$route.name !== 'explore'">
            <HostList />
          </v-col>
          <!-- Use full width if on explore route -->
          <v-col :cols="$route.name === 'explore' ? 12 : 9" :lg="$route.name === 'explore' ? 12 : 9">
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

@media (min-width: 1280px) {
  .host-list-panel {
    position: sticky;
    top: 68px;
    align-self: flex-start;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    height: calc(100vh - 80px);
  }
}

@media (max-width: 1279px) {
  .host-list-panel {
    position: relative;
  }
}
</style>
