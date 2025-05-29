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

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  } catch (e) {
    return "-";
  }
};

export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    // Less than a month
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    // Less than a year
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
    }

    // More than a year
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
  } catch (e) {
    console.error("Error formatting relative time:", e);
    return dateString;
  }
};

export const formatMixedTimestamp = (timestamp: number | string): string => {
  if (!timestamp) return "N/A";

  if (typeof timestamp === "string" && timestamp.includes("-")) {
    return new Date(timestamp).toISOString().split("T")[0];
  }

  const timestampNum = Number(timestamp);
  let date;

  date = new Date(timestampNum * 1000);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toISOString().split("T")[0];
};
