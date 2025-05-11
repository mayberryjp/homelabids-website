import { defineStore } from "pinia";
import { ref } from "vue";

export const useCounterStore = defineStore("localhosts", () => {
  const hosts = ref([]);

  return { hosts };
});
