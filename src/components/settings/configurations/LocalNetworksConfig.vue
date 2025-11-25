<!-- filepath: c:\Users\rimayber\Documents\vscode_projects\homelabids-website\src\components\settings\LocalNetworksConfig.vue -->
<template>
  <v-card class="pa-6" color="#0d1117">
    <h2 class="mb-4 text-h5">Local Networks Configuration</h2>
    <v-row
      v-for="(network, idx) in localNetworks"
      :key="idx"
      class="mb-6"
      align="start"
    >
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="network.cidr"
          label="CIDR"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="network.router"
          label="Router IP Address"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="network.domain_name"
          label="Domain Name"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="network.ttl"
          label="TTL"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-combobox
          v-model="network.dns_servers"
          label="DNS Servers"
          variant="outlined"
          density="comfortable"
          multiple
          clearable
          :items="[]"
          hint="Comma separated IPs"
          persistent-hint
        />
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-combobox
          v-model="network.ntp_servers"
          label="NTP Servers"
          variant="outlined"
          density="comfortable"
          multiple
          clearable
          :items="[]"
          hint="Comma separated IPs"
          persistent-hint
        />
      </v-col>
      <v-col cols="12" class="d-flex align-center">
        <v-btn icon="mdi-delete" color="error" @click="removeNetwork(idx)" />
      </v-col>
    </v-row>
    <v-btn color="primary" @click="addNetwork" class="mb-4" prepend-icon="mdi-plus">
      Add Network
    </v-btn>
    <v-row>
      <v-col cols="12">
        <v-btn color="success" @click="saveNetworks" prepend-icon="mdi-content-save" class="mb-2">
          Save Changes
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getConfigurations, updateConfiguration } from "@/services/settings";
import { useNotificationStore } from "@/stores/notification";

const notificationStore = useNotificationStore();

const localNetworks = ref<Array<{
  cidr: string;
  router: string;
  dns_servers: string[];
  ntp_servers: string[];
  domain_name: string;
  ttl?: string;
}>>([]);

const fetchLocalNetworks = async () => {
  try {
    const { data } = await getConfigurations();
    // Find the LocalNetworks config item
    let networks = null;
    if (Array.isArray(data)) {
      networks = data.find((item: any) => item.key === "LocalNetworks");
    } else if (data && data.LocalNetworks) {
      networks = { value: data.LocalNetworks };
    }

    let value = [];
    if (networks) {
      if (Array.isArray(networks.value)) {
        value = networks.value;
      } else if (typeof networks.value === "string") {
        // Try to parse JSON string
        try {
          value = JSON.parse(networks.value);
        } catch {
          value = [];
        }
      }
    }

    localNetworks.value = Array.isArray(value)
      ? value.map((net: any) => ({
          cidr: net.cidr || "",
          router: net.router || "",
          dns_servers: net.dns_servers || [],
          ntp_servers: net.ntp_servers || [],
          domain_name: net.domain_name || "",
          ttl: net.ttl || "",
        }))
      : [];
  } catch (error) {
    notificationStore.showError("Failed to load local networks.");
    localNetworks.value = [];
  }
};

const addNetwork = () => {
  localNetworks.value.push({
    cidr: "",
    router: "",
    dns_servers: [],
    ntp_servers: [],
    domain_name: "",
    ttl: "",
  });
};

const removeNetwork = (idx: number) => {
  localNetworks.value.splice(idx, 1);
};

const saveNetworks = async () => {
  try {
    // Ensure dns_servers and ntp_servers are arrays of strings
    const payload = localNetworks.value.map(net => ({
      ...net,
      dns_servers: Array.isArray(net.dns_servers)
        ? net.dns_servers.flatMap(s =>
            typeof s === "string" ? s.split(",").map(x => x.trim()).filter(Boolean) : []
          )
        : [],
      ntp_servers: Array.isArray(net.ntp_servers)
        ? net.ntp_servers.flatMap(s =>
            typeof s === "string" ? s.split(",").map(x => x.trim()).filter(Boolean) : []
          )
        : [],
    }));

    await updateConfiguration({
      key: "LocalNetworks",
      value: JSON.stringify(payload), // <-- Stringify here!
    });
    notificationStore.showSuccess("Local networks updated successfully.");
  } catch (error) {
    notificationStore.showError("Failed to save local networks.");
  }
};

onMounted(fetchLocalNetworks);
</script>