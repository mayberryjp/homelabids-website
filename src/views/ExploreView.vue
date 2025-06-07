<template>
  <v-container fluid class="pa-4">
    <v-row>


      <v-col cols="12">
        <v-sheet
          rounded="lg"
          color="#090c10"
          class="pa-4"
          style="display: flex; align-items: flex-start; gap: 16px; max-width: 100%;"
        >
          <v-text-field
            v-model="searchQuery"
            density="compact"
            variant="outlined"
            label="Search flows..."
            prepend-inner-icon="mdi-magnify"
            @input="handleSearchInput"
            hide-details
            style="max-width: 400px;"
          >
            <template v-slot:append>
              <v-progress-circular
                v-if="isDebouncing"
                indeterminate
                size="20"
                width="2"
                color="primary"
              ></v-progress-circular>
            </template>
          </v-text-field>
          <!-- Make the alert fill the rest of the row -->
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            border="start"
            color="primary"
            class="pa-2"
            style="flex: 1; margin-top: 0;"
          >
            <span>
              <strong>Search tips:</strong> You can search by IP, port, Geolocation, ISP, Allowlist name, DNS name, and partial timestamp in YYYY-MM-DD HH:MM:SS format. Only single word simple text searches are supported. Example: <code>8.8.8.8</code>, <code>China</code>, <code>Amazon</code>, <code>example.com</code>, <code>2025-06-05 21:49:52</code>. The most specific host detail available is provided (e.g: domain name or ISP or country). If you want to match a specific parameter explicitly use _parameter_. For example, "_192.168.1.1_".
            </span>
          </v-alert>
        </v-sheet>
      </v-col>

      <!-- Remove extra margin between search and table -->
      <v-col cols="12" class="mt-2">
        <ExploreTable
          :data="tableData"
          :loading="loading"
          :totalItems="totalItems"
          @changePage="handlePageChange"
          @changeItemsPerPage="handleItemsPerPageChange"
          @refresh="refreshData"
        />
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { getExplore, getExploreSearch } from "@/services/explore";
import ExploreTable from "@/components/explore/ExploreTable.vue";
import { useDebounce } from "@/utils/debounce";
import type { ExploreFlow } from "@/types/explore";
import { useNotificationStore } from "@/stores/notification";

const INITIAL_ITEMS_PER_PAGE = 100;
const itemsPerPage = ref(INITIAL_ITEMS_PER_PAGE);
const currentPage = ref(0);
const totalItems = ref(0);
const loading = ref(true);
const tableData = ref<ExploreFlow[]>([]);
const searchQuery = ref("");
const isSearchMode = ref(false);

// Initialize notification store
const notificationStore = useNotificationStore();

const { debounce, isDebouncing } = useDebounce<string>(700);

const loadData = async () => {
  loading.value = true;
  try {
    const data = await getExplore({
      page: currentPage.value,
      limit: itemsPerPage.value,
    });

    console.log("Explore data response:", data);

    if (data.success) {
      tableData.value = data.data.results || [];
      totalItems.value = data.data.total || 0;
    } else {
      tableData.value = [];
      totalItems.value = 0;
      notificationStore.showError("Failed to load data");
    }
  } catch (error) {
    console.error("Error fetching explore data:", error);
    notificationStore.showError("Error loading data");
  } finally {
    loading.value = false;
  }
};

// Search data
const searchData = async (query: string) => {
  if (!query.trim()) {
    isSearchMode.value = false;
    loadData();
    return;
  }

  isSearchMode.value = true;
  loading.value = true;

  try {
    const response = await getExploreSearch(query, {
      page: currentPage.value,
      limit: itemsPerPage.value,
    });

    if (response.success) {
      tableData.value = response.data.results || [];
      // For search results, use the data length as an estimate for total items
      // or keep the current total if there are no results
      totalItems.value = response.data.total || 0;

      if (response.data.total === 0) {
        notificationStore.showInfo("No results found for your search");
      }
    } else {
      tableData.value = [];
      totalItems.value = 0;
      notificationStore.showError("Search failed");
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    notificationStore.showError("Error performing search");
  } finally {
    loading.value = false;
  }
};

// Refresh data
const refreshData = () => {
  if (isSearchMode.value && searchQuery.value) {
    searchData(searchQuery.value);
  } else {
    loadData();
  }
};

// Handle search input with debounce
const handleSearchInput = () => {
  currentPage.value = 0;
  debounce((query: string) => {
    searchData(query);
  }, searchQuery.value);
};

// Handle page change
const handlePageChange = (page: number) => {
  currentPage.value = page;

  if (isSearchMode.value && searchQuery.value) {
    searchData(searchQuery.value);
  } else {
    loadData();
  }
};

// Handle items per page change
const handleItemsPerPageChange = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage;
  currentPage.value = 0; // Reset to first page when changing items per page
  
  if (isSearchMode.value && searchQuery.value) {
    searchData(searchQuery.value);
  } else {
    loadData();
  }
};

// Load initial data on mount
onMounted(loadData);

// Reset to page 0 when search query changes
watch(searchQuery, () => {
  if (searchQuery.value === "") {
    isSearchMode.value = false;
    currentPage.value = 0;
    loadData();
  }
});
</script>
