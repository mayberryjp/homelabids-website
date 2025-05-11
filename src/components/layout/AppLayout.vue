<template>
  <v-app>
    <!-- Header -->
    <v-app-bar color="#181b22" dark app elevation="1">
      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-btn 
          :to="{ path: '/app/explore' }" 
          variant="text" 
          class="mx-2" 
          rounded
          :color="$route.path === '/app/explore' ? 'rose' : ''"
        >
          <v-icon start>mdi-page-layout-header</v-icon>
          Status Pages
        </v-btn>

        <v-btn 
          :to="{ path: '/app' }" 
          variant="text"
          class="mx-2" 
          rounded
          :color="$route.path === '/app' ? 'rose' : ''"
        >
          <v-icon start>mdi-view-dashboard</v-icon>
          Dashboard
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppLayout",
});
</script>

<style scoped>
.v-app-bar {
  border-bottom: 0px !important;
  box-shadow: none !important;
}

.v-main {
  background-color: #0a0c10;
  color: rgba(255, 255, 255, 0.87);
}
</style>
