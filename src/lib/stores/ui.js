import {writable} from "svelte/store";

// Toast notifications store
export const toast = writable({
  show: false,
  message: "",
  type: "success", // success, error, info
  duration: 3000,
  refreshPage: false,
});

// Show a toast notification
export function showToast(
  message,
  type = "success",
  duration = 3000,
  refreshPage = false
) {
  toast.set({
    show: true,
    message,
    type,
    duration,
    refreshPage,
  });

  // Auto-hide after duration
  if (duration > 0) {
    setTimeout(() => {
      toast.update((t) => ({...t, show: false}));

      // Refresh page if needed
      if (refreshPage) {
        setTimeout(() => window.location.reload(), 100);
      }
    }, duration);
  }
}

// Loading states for various operations
export const loadingStates = writable({
  navigation: false,
  formSubmission: false,
  dataFetching: false,
});

// Set/clear loading state
export function setLoading(key, isLoading) {
  loadingStates.update((states) => ({
    ...states,
    [key]: isLoading,
  }));
}
