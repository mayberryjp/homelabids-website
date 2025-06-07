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

export const getHostRecentAlerts = async (ip_address: string) => {
  try {
    const response = await api.get(`/alerts/recent/${ip_address}`);
    return response;
  } catch (error) {
    console.error("Error fetching recent alerts:", error);
    throw error;
  }
};

export const acknowledgeAlert = async (
  alertId: string,
  acknowledge: boolean = true
) => {
  try {
    const response = await api.put(`/alerts/${alertId}`, {
      acknowledged: acknowledge ? 1 : 0,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating acknowledgement for alert ${alertId}:`,
      error
    );
    throw error;
  }
};

export const deleteAlert = async (alertId: string) => {
  try {
    const response = await api.delete(`/alerts/${alertId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting alert ${alertId}:`, error);
    throw error;
  }
};

export interface WhitelistPayload {
  ignorelist_id: string;
  src_ip: string;
  dst_ip: string;
  src_port?: string | number;
  dst_port: string | number;
  protocol: string;
}

export const addToWhitelist = async (payload: WhitelistPayload) => {
  try {
    const response = await api.post("/ignorelist", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding to ignorelist:", error);
    throw error;
  }
};

export const updateAlertsEnabled = async (
  ip_address: string,
  alerts_enabled: boolean
) => {
  try {
    const response = await api.put(`/localhosts/${ip_address}/alerts-enabled`, {
      alerts_enabled,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating alerts enabled status:", error);
    throw error;
  }
};

export const deleteAllAlerts = async () => {
  try {
    const response = await api.delete(`/alerts/all`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting all alerts`, error);
    throw error;
  }
};

export const forceThreatCollection = async () => {
  try {
    const response = await api.post(`/threatscore`);
    return response.data;
  } catch (error) {
    console.error(`Error forcing threat collection`, error);
    throw error;
  }
};
