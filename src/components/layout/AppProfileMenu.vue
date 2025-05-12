<template>
  <v-menu rounded :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" class="ml-2">
        <v-avatar color="rose" size="36">
          <v-icon icon="mdi-account"></v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-card :min-width="$vuetify.display.xs ? '90vw' : '200px'">
      <v-list>
        <v-list-item
          v-for="(item, index) in profileMenuItems"
          :key="index"
          :to="item.routeName ? { name: item.routeName } : undefined"
          link
          @click="item.action ? item.action() : null"
        >
          <v-list-item-title>
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const profileMenuItems = ref([
  {
    title: "Settings",
    icon: "mdi-cog",
    routeName: "settings",
  },
  {
    title: "Logout",
    icon: "mdi-logout",
    action: () => {
      // Add logout logic here
      console.log("Logging out...");
      router.push({ name: "login" });
    },
  },
]);
</script>
