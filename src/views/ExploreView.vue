<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h5 mb-6">Data Explorer</h1>
      </v-col>

      <v-col cols="12">
        <v-sheet rounded="lg" color="#090c10">
          <v-text-field
            v-model="searchQuery"
            density="compact"
            variant="outlined"
            label="Search flows..."
            prepend-inner-icon="mdi-magnify"
            clearable
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
        </v-sheet>
      </v-col>

      <v-col cols="12">
        <ExploreTable
          :data="tableData"
          :loading="loading"
          :currentPage="currentPage"
          :pageSize="pageSize"
          :totalItems="totalItems"
          @changePage="handlePageChange"
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

const pageSize = ref(100);
const currentPage = ref(0);
const totalItems = ref(0);
const loading = ref(true);
const tableData = ref<ExploreFlow[]>([]);
const searchQuery = ref("");
const isSearchMode = ref(false);

const { debounce, isDebouncing } = useDebounce<string>(700);

// Load initial data
const loadData = async () => {
  loading.value = true;
  try {
    const response = await getExplore({
      page: currentPage.value,
      limit: pageSize.value,
    });

    if (response.success && response.data) {
      tableData.value = response.data.results || [];
      totalItems.value = response.data.total || 0;
    } else {
      tableData.value = [];
      totalItems.value = 0;
    }
  } catch (error) {
    console.error("Error fetching explore data:", error);
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
      limit: pageSize.value,
    });

    if (response.success && response.data) {
      tableData.value = response.data.results || [];
      totalItems.value = response.data.total || 0;
    } else {
      tableData.value = [];
      totalItems.value = 0;
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
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
