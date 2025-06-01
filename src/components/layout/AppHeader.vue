<template>
  <v-app-bar color="background-100" dark app elevation="1">
  
      <!-- Product Logo and Name (Left Justified) -->
    <div class="product-branding d-flex align-center">
      <router-link to="/" class="router-link">
        <img src="/logo.png" alt="Product Logo" width="32px" height="32px" class="me-2" />
        <span class="product-name text-h6">Homelab IDS</span>
      </router-link>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <v-btn
        v-for="(item, index) in menuItems"
        :key="index"
        :to="{ name: item.routeName }"
        variant="text"
        class="mx-2"
        rounded
        :color="$route.name === item.routeName ? 'rose' : ''"
      >
        <v-icon start>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>

      <!-- GitHub Issues Link -->
      <v-btn
        href="https://github.com/mayberryjp/homelabids/issues"
        target="_blank"
        rel="noopener noreferrer"
        variant="text"
        class="mx-2"
        rounded
      >
        <v-icon start>mdi-github</v-icon>
        Submit Issues or Features
      </v-btn>

      <!-- Notification Bell Component -->
      <AppNotifications />

      <!-- Profile Dropdown Component -->
      <AppProfileMenu />
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppNotifications from '@/components/layout/AppNotifications.vue';
import AppProfileMenu from '@/components/layout/AppProfileMenu.vue';

const menuItems = ref([
  {
    title: "Data Explorer",
    icon: "mdi-page-layout-header",
    routeName: "explore",
  },
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    routeName: "dashboard",
  },
]);
</script>

<style scoped>
.v-app-bar {
  border-bottom: 0px !important;
  box-shadow: none !important;
}

.product-name {
  color: #cf8e13;
  font-weight: 700;
  font-size: 1.5rem !important;
  text-align: start;
  line-height: 36px;
  font-size: 24px;
  text-size-adjust: 100%;
  letter-spacing: 0.05em !important;
}

.v-app-bar {
  border-bottom: 0px !important;
  box-shadow: none !important;
}

.product-branding {
  margin-left: 35px;
  margin-top: 5px;
}

.mx-2 {
  text-transform: capitalize;
  color: #b1b8c0;
  font-size: 16px !important;
  font-weight: 400;
  letter-spacing: 0em !important;
}

.router-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

</style>
