import api from "./api";

export const getQuickStats = async () => {
  try {
    const response = await api.get("/quickstats");
    console.log("Quick stats fetched successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    throw error;
  }
};
