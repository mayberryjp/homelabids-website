import api from "./api";

export const getRecentAlerts = async () => {
  try {
    const response = await api.get("/alerts/recent");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent alerts:", error);
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


export const getHostAlertDetails = async (ip_address: string) => {
  try {
    const response = await api.get(`/alerts/summary/${ip_address}`);
    return response;
  } catch (error) {
    console.error("Error fetching alert details:", error);
    throw error;
  }
};