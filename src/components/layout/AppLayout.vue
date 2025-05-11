<template>
  <v-app>
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <v-row style="min-height: 100%">
          <!-- Left Panel -->
          <v-col cols="3">
            <v-sheet class="rounded" height="100%" color="background-100">
            </v-sheet>
          </v-col>

          <!-- Right Panel (Main Content) -->
          <v-col cols="9">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
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
