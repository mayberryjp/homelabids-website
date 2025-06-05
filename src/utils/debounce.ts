import { ref } from "vue";

export function useDebounce<T>(delay: number = 800) {
  const isDebouncing = ref(false);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounce = (fn: Function, value: T) => {
    isDebouncing.value = true;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(value);
      isDebouncing.value = false;
      timeout = null;
    }, delay);
  };

  return {
    debounce,
    isDebouncing,
  };
}
