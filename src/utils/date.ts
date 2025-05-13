export const formatDateTime = (
  dateString: string,
  includeSeconds = true
): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: includeSeconds ? "2-digit" : undefined,
      hour12: false,
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};
