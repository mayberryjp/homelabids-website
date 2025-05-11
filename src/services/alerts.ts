import api from "./api";

export const getAlerts = async () => {
  try {
    const response = await api.get("/alerts/recent");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent alerts:", error);
    throw error;
  }
};
