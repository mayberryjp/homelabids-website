import api from "./api";

export const getLocalhosts = async () => {
  try {
    const response = await api.get("localhosts");
    return response;
  } catch (error) {
    console.error("Error fetching localhosts:", error);
    throw error;
  }
};

export const getLocalhostDetail = async (ip_address: string) => {
  try {
    const response = await api.get(`localhosts/${ip_address}`);
    return response;
  } catch (error) {
    console.error("Error fetching localhosts:", error);
    throw error;
  }
};

export const getLocalhostTraffic = async (ip_address: string) => {
  try {
    const response = await api.get(`trafficstats/${ip_address}`);
    return response;
  } catch (error) {
    console.error("Error fetching localhosts:", error);
    throw error;
  }
};

export const deleteHost = async (ip_address: string) => {
  try {
    const response = await api.delete(`localhosts/${ip_address}`);
    return response;
  } catch (error) {
    console.error("Error deleting host:", error);
    throw error;
  }
};

export const updateHost = async (
  ip_address: string,
  hostData: Partial<{
    local_description: string;
    tags: string;
    icon: string;
    alerts_enabled: number;
    management_link: string;
  }>
) => {
  try {
    const response = await api.put(`localhosts/${ip_address}`, hostData);
    return response;
  } catch (error) {
    console.error("Error updating host:", error);
    throw error;
  }
};

export const getDeviceCategories = async () => {
  try {
    const response = await api.get("devices");
    return response;
  } catch (error) {
    console.error("Error fetching device categories:", error);
    throw error;
  }
};

export const autoClassifyDevice = async (ip_address: string) => {
  try {
    const response = await api.get(`classify/${ip_address}`);
    return response;
  } catch (error) {
    console.error("Error auto-classifying device:", error);
    throw error;
  }
};

export const getLocalhostIgnoreList = async (ip_address: string) => {
  try {
    const response = await api.get(`ignorelist/ip/${ip_address}`);
    return response;
  } catch (error) {
    console.error("Error fetching host ignore list:", error);
    throw error;
  }
};

export const deleteIgnoreListItem = async (allowlistId: string) => {
  try {
    const response = await api.delete(`ignorelist/${allowlistId}`);
    return response;
  } catch (error) {
    console.error("Error deleting ignore list item:", error);
    throw error;
  }
};

export const addLocalhostTag = async (ip_address: string, tag: string) => {
  try {
    const response = await api.put(`localhosttags/${ip_address}`, {
      tag: tag,
    });
    return response;
  } catch (error) {
    console.error("Error adding tag to localhost:", error);
    throw error;
  }
};

export const removeLocalhostTag = async (ip_address: string, tag: string) => {
  try {
    const response = await api.delete(`localhosttags/${ip_address}`, {
      data: { tag: tag },
    });
    return response;
  } catch (error) {
    console.error("Error removing tag from localhost:", error);
    throw error;
  }
};
