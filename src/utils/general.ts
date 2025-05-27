export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const openUrlSafely = (
  url: string,
  windowFeatures = "noopener,noreferrer"
): void => {
  if (!isValidUrl(url)) {
    console.warn("Invalid URL provided to openUrlSafely:", url);
    return;
  }

  window.open(url, "_blank", windowFeatures);
};

export const createUrlValidationRule = (
  required = false,
  allowEmpty = true
) => {
  return (value: string): boolean | string => {
    // Handle empty values
    if (!value || value.trim() === "") {
      if (required) {
        return "URL is required";
      }
      if (allowEmpty) {
        return true;
      }
    }

    // Validate URL format
    if (value && !isValidUrl(value)) {
      return "Please enter a valid URL (e.g., https://example.com)";
    }

    return true;
  };
};
