import api from "./api";

export const getQuickStats = async () => {
  try {
    const response = await api.get("/quickstats");
    return response.data;
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    throw error;
  }
};
