<template>
  <div class="host-actions">
    <v-btn
      icon
      @click="openEditDialog"
      color="primary"
      class="me-2"
      size="small"
      variant="outlined"
    >
      <v-icon size="small">mdi-pencil</v-icon>
    </v-btn>
    <v-btn
      icon
      @click="openDeleteDialog"
      color="#a0364d"
      size="small"
      variant="outlined"
    >
      <v-icon size="small">mdi-delete</v-icon>
    </v-btn>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card class="pa-2">
        <v-card-title>Delete Host</v-card-title>
        <v-card-text>
          Are you sure you want to delete the host with IP address:
          {{ ipAddress }}? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="#a0364d" text @click="confirmDelete" :loading="isDeleting"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { deleteHost } from "@/services/hosts";
import { useHostsStore } from "@/stores/hosts";

const props = defineProps({
  ipAddress: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const hostsStore = useHostsStore();
const deleteDialog = ref(false);
const isDeleting = ref(false);

const openEditDialog = () => {
  console.log("Edit host:", props.ipAddress);
};

const openDeleteDialog = () => {
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    await deleteHost(props.ipAddress);
    // Close the dialog
    deleteDialog.value = false;
    // Refresh the hosts list in the store
    await hostsStore.fetchLocalhosts();
    // Navigate back to dashboard
    router.push({ name: "dashboard" });
  } catch (error) {
    console.error("Error deleting host:", error);
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.host-actions {
  display: flex;
  align-items: center;
}
</style>
