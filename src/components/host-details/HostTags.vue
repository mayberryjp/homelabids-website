<template>
  <div class="host-tags">
    <div class="tags-container">
      <!-- Existing Tags -->
      <v-chip
        v-for="tag in tagList"
        :key="tag"
        size="small"
        color="primary"
        variant="outlined"
        closable
        @click:close="removeTag(tag)"
        :disabled="operationInProgress"
        class="tag-chip me-2 mb-2"
      >
        {{ tag }}
      </v-chip>

      <!-- Add Tag Chip -->
      <v-chip
        v-if="!isAddingTag"
        size="small"
        color="primary"
        variant="outlined"
        @click="startAddTag"
        :disabled="operationInProgress"
        class="add-tag-chip me-2 mb-2"
        prepend-icon="mdi-plus"
      >
        Add Tag
      </v-chip>

      <!-- Add Tag Input -->
      <div v-else class="add-tag-input me-2 mb-2">
        <v-text-field
          ref="tagInput"
          v-model="newTagName"
          variant="outlined"
          density="compact"
          placeholder="Enter tag name"
          hide-details
          @keyup.enter="addTag"
          @keyup.escape="cancelAddTag"
          @blur="handleInputBlur"
          class="tag-input-field"
          :disabled="operationInProgress"
          :loading="operationInProgress"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { addLocalhostTag, removeLocalhostTag } from "@/services/hosts";
import { useNotificationStore } from "@/stores/notification";

const props = defineProps<{
  tags: string | null;
  ipAddress: string;
}>();

const emit = defineEmits<{
  tagsUpdated: [tags: string | null];
}>();

// Reactive state
const isAddingTag = ref(false);
const newTagName = ref("");
const operationInProgress = ref(false);
const tagInput = ref<any>(null);

const notificationStore = useNotificationStore();

// Computed properties
const tagList = computed(() => {
  if (!props.tags || typeof props.tags !== 'string') return [];
  return props.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
});

// Methods
const startAddTag = async () => {
  isAddingTag.value = true;
  await nextTick();
  if (tagInput.value) {
    tagInput.value.focus();
  }
};

const cancelAddTag = () => {
  isAddingTag.value = false;
  newTagName.value = "";
};

const handleInputBlur = () => {
  // Small delay to allow click events to fire first
  setTimeout(() => {
    if (newTagName.value.trim()) {
      addTag();
    } else {
      cancelAddTag();
    }
  }, 150);
};

const addTag = async () => {
  const tagName = newTagName.value.trim();
  if (!tagName || operationInProgress.value) {
    cancelAddTag();
    return;
  }

  // Check if tag already exists
  if (tagList.value.includes(tagName)) {
    notificationStore.showError("Tag already exists");
    cancelAddTag();
    return;
  }

  operationInProgress.value = true;

  try {
    await addLocalhostTag(props.ipAddress, tagName);
    
    // Update tags locally - convert back to comma-separated string
    const currentTags = tagList.value;
    const newTags = [...currentTags, tagName].join(',');
    
    emit('tagsUpdated', newTags);
    notificationStore.showSuccess(`Tag "${tagName}" added successfully`);
    
    cancelAddTag();
  } catch (error) {
    console.error("Error adding tag:", error);
    notificationStore.showError("Failed to add tag");
  } finally {
    operationInProgress.value = false;
  }
};

const removeTag = async (tagToRemove: string) => {
  if (operationInProgress.value) return;

  operationInProgress.value = true;

  try {
    await removeLocalhostTag(props.ipAddress, tagToRemove);
    
    // Update tags locally - convert back to comma-separated string
    const remainingTags = tagList.value.filter((tag: string) => tag !== tagToRemove);
    const newTags = remainingTags.length > 0 ? remainingTags.join(',') : null;
    
    emit('tagsUpdated', newTags);
    notificationStore.showSuccess(`Tag "${tagToRemove}" removed successfully`);
  } catch (error) {
    console.error("Error removing tag:", error);
    notificationStore.showError("Failed to remove tag");
  } finally {
    operationInProgress.value = false;
  }
};

// Watch for external tag changes
watch(() => props.tags, () => {
  // Cancel add mode if tags change externally
  if (isAddingTag.value) {
    cancelAddTag();
  }
});
</script>

<style scoped>
.host-tags {
  max-width: 100%;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px;
  padding-top: 4px
}

.tag-chip {
  background-color: rgba(92, 221, 139, 0.15) !important;
  border-color: rgb(92, 221, 139) !important;
  color: rgb(92, 221, 139) !important;
  max-width: 200px;
}

.tag-chip :deep(.v-chip__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-tag-chip {
  background-color: rgba(92, 221, 139, 0.1) !important;
  border-color: rgba(92, 221, 139, 0.6) !important;
  color: rgba(92, 221, 139, 0.8) !important;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-tag-chip:hover {
  background-color: rgba(92, 221, 139, 0.2) !important;
  border-color: rgb(92, 221, 139) !important;
  color: rgb(92, 221, 139) !important;
}

.add-tag-input {
  min-width: 160px;
  max-width: 200px;
}

.tag-input-field {
  height: 32px;
}

.tag-input-field :deep(.v-field) {
  height: 32px !important;
}

.tag-input-field :deep(.v-field__input) {
  min-height: 32px !important;
  padding-top: 4px;
  padding-bottom: 4px;
}

/* Disabled state styling */
.tag-chip:disabled {
  opacity: 0.6;
}

.add-tag-chip:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-tag-chip:disabled:hover {
  background-color: rgba(92, 221, 139, 0.1) !important;
  border-color: rgba(92, 221, 139, 0.6) !important;
  color: rgba(92, 221, 139, 0.8) !important;
}
</style>
