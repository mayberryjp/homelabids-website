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

export const getLocalhosts = async () => {
  try {
    const response = await api.get("localhosts");
    return response;
  } catch (error) {
    console.error("Error fetching localhosts:", error);
    throw error;
  }
};

export const getAlertSummary = async () => {
  try {
    const response = await api.get("/alerts/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching alert summary:", error);
    throw error;
  }
};
