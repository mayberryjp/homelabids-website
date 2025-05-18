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
