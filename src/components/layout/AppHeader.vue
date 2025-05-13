<template>
  <v-app-bar color="background-100" dark app elevation="1">
  
      <!-- Product Logo and Name (Left Justified) -->
    <div class="product-branding d-flex align-center">
      <img src="/logo.png" alt="Product Logo" width="32px" height="32px" class="me-2" />
      <v-img
        src="/logo.png"
        alt="Product Logo"
        class="me-2"
      ></v-img>
      <span class="product-name text-h6">Homelab IDS</span>
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
    title: "Status Pages",
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
}

</style>
