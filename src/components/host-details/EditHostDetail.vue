<template>
  <v-card color="#0d1117" class="pa-6">
    <!-- Header -->
    <v-row align="center" class="mb-8">
      <v-col>
        <h1 class="text-h4 text-grey-lighten-1 font-weight-medium">Edit</h1>
      </v-col>
    </v-row>

    <!-- Form Container -->
    <v-row>
      <v-col cols="12" md="8" lg="6">
        <v-form ref="form" v-model="valid" @submit.prevent="saveHost">
          <!-- Device Category Dropdown -->
          <v-select
            v-model="formData.category"
            :items="deviceCategories"
            item-title="name"
            item-value="value"
            label="Device Category"
            variant="outlined"
            density="comfortable"
            class="mb-2"
            :loading="categoriesLoading"
            :disabled="categoriesLoading"
            clearable
            prepend-inner-icon="mdi-devices"
            hide-details
          >
            <template #no-data>
              <v-list-item>
                <v-list-item-title>
                  {{
                    categoriesError
                      ? "Failed to load categories"
                      : "No categories available"
                  }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-select>

          <!-- Auto Classification Button -->
          <div class="mb-6">
            <v-btn
              variant="outlined"
              size="small"
              color="info"
              :loading="classifying"
              :disabled="!props.hostDetail || classifying"
              @click="attemptAutoClassify"
              class="mb-2"
              prepend-icon="mdi-auto-fix"
            >
              Attempt To Auto Classify Device
            </v-btn>

            <div
              v-if="classificationOptions.length > 0"
              class="mt-1 text-caption text-grey"
            >
              <div><strong>Possible device types:</strong></div>
              <v-chip-group>
                <v-chip
                  v-for="(option, index) in classificationOptions"
                  :key="index"
                  size="x-small"
                  variant="outlined"
                  color="primary"
                  @click="selectClassification(option)"
                  class="chip-hover"
                  :class="{
                    'selected-chip': formData.category === option.value,
                  }"
                  elevation="0"
                >
                  {{ option.name }}
                </v-chip>
              </v-chip-group>
            </div>
          </div>

          <!-- Friendly Name -->
          <v-text-field
            v-model="formData.friendlyName"
            label="Friendly Name"
            variant="outlined"
            density="comfortable"
            class="mb-6"
            prepend-inner-icon="mdi-tag"
            hint="A descriptive name for this device"
            persistent-hint
            clearable
          />

          <!-- Management Link -->
          <v-text-field
            v-model="formData.managementLink"
            label="Management Link"
            variant="outlined"
            density="comfortable"
            class="mb-6"
            prepend-inner-icon="mdi-link"
            hint="URL to the device's management interface"
            persistent-hint
            clearable
            type="url"
            placeholder="https://..."
            :rules="[urlValidationRule]"
          >
            <template
              #append-inner
              v-if="
                formData.managementLink && isValidUrl(formData.managementLink)
              "
            >
              <v-tooltip text="Test Link" location="top">
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    icon="mdi-open-in-new"
                    variant="text"
                    size="small"
                    @click="openManagementLink"
                    color="primary"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-text-field>

          <!-- Action Buttons -->
          <v-row justify="end" class="mt-8">
            <v-col cols="auto">
              <v-btn
                variant="outlined"
                @click="$emit('close')"
                :disabled="saving"
                class="me-3"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="saving"
                :disabled="!hasChanges || saving"
              >
                Save Changes
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <!-- Success/Error Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      location="bottom"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { Localhost } from "@/types/localhosts";
import {
  updateHost,
  getDeviceCategories,
  autoClassifyDevice,
} from "@/services/hosts";
import {
  isValidUrl,
  openUrlSafely,
  createUrlValidationRule,
} from "@/utils/general";

// Props
const props = defineProps<{
  hostDetail: Localhost | null;
}>();

// Emits
const emit = defineEmits<{
  close: [];
  saved: [];
}>();

// Reactive data
const valid = ref(false);
const saving = ref(false);
const categoriesLoading = ref(false);
const categoriesError = ref(false);
const deviceCategories = ref<Array<{ name: string; value: string }>>([]);
const classifying = ref(false);
const classificationOptions = ref<Array<{ name: string; value: string }>>([]);

const formData = ref({
  category: "",
  friendlyName: "",
  managementLink: "",
});

const originalData = ref({
  category: "",
  friendlyName: "",
  managementLink: "",
});

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

// Computed
const hasChanges = computed(() => {
  return (
    formData.value.category !== originalData.value.category ||
    formData.value.friendlyName !== originalData.value.friendlyName ||
    formData.value.managementLink !== originalData.value.managementLink
  );
});

const urlValidationRule = createUrlValidationRule(false, true);

const openManagementLink = () => {
  if (
    formData.value.managementLink &&
    isValidUrl(formData.value.managementLink)
  ) {
    openUrlSafely(formData.value.managementLink);
  }
};

// Methods
const loadDeviceCategories = async () => {
  categoriesLoading.value = true;
  categoriesError.value = false;

  try {
    const { data } = await getDeviceCategories();
    // Transform the API response to the expected format and sort alphabetically
    if (Array.isArray(data)) {
      deviceCategories.value = data
        .map((category: string) => ({
          name: category,
          value: category,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
    }
  } catch (error) {
    console.error("Error loading device categories:", error);
    categoriesError.value = true;
  } finally {
    categoriesLoading.value = false;
  }
};

const attemptAutoClassify = async () => {
  if (!props.hostDetail) return;

  classifying.value = true;
  classificationOptions.value = [];

  try {
    const { data } = await autoClassifyDevice(props.hostDetail.ip_address);

    if (data && data.best_match && Array.isArray(data.best_match)) {
      classificationOptions.value = data.best_match.map((category: string) => ({
        name: category,
        value: category,
      }));

      if (classificationOptions.value.length > 0) {
        formData.value.category = classificationOptions.value[0].value;
      }
    }
  } catch (error) {
    console.error("Error auto-classifying device:", error);
    snackbar.value = {
      show: true,
      text: "Failed to auto-classify device. Please try again.",
      color: "error",
    };
  } finally {
    classifying.value = false;
  }
};

const selectClassification = (option: { name: string; value: string }) => {
  formData.value.category = option.value;
};

const initializeForm = () => {
  if (props.hostDetail) {
    const friendlyName = props.hostDetail.local_description || "";
    const managementLink = props.hostDetail.management_link || "";
    const category = props.hostDetail.icon || ""; // Map icon to category for now

    formData.value = {
      category,
      friendlyName,
      managementLink,
    };

    originalData.value = {
      category,
      friendlyName,
      managementLink,
    };
  }
};

const saveHost = async () => {
  if (!props.hostDetail || !valid.value) return;

  saving.value = true;

  try {
    const updateData = {
      local_description: formData.value.friendlyName,
      management_link: formData.value.managementLink,
      icon: formData.value.category,
    };

    await updateHost(props.hostDetail.ip_address, updateData);

    originalData.value = { ...formData.value };

    emit("saved");

    snackbar.value = {
      show: true,
      text: "Host details updated successfully",
      color: "success",
    };

    setTimeout(() => {
      emit("close");
    }, 1000);
  } catch (error) {
    console.error("Error saving host details:", error);
    snackbar.value = {
      show: true,
      text: "Failed to update host details. Please try again.",
      color: "error",
    };
  } finally {
    saving.value = false;
  }
};

// Watchers
watch(() => props.hostDetail, initializeForm, { immediate: true });

// Lifecycle
onMounted(() => {
  loadDeviceCategories();
  initializeForm();
});
</script>

<style scoped>
.chip-hover {
  transition: all 0.2s ease;
  cursor: pointer;
}

.chip-hover:hover {
  transform: translateY(-2px);
}

.selected-chip {
  background-color: rgba(var(--v-theme-primary), 0.15);
  font-weight: bold;
}
</style>
