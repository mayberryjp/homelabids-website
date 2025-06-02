import api from "./api";

export const getConfigurations = async () => {
  try {
    const response = await api.get("/configurations");
    return response;
  } catch (error) {
    console.error("Error fetching configuration:", error);
    throw error;
  }
};

export const updateConfiguration = async (config: Record<string, any>) => {
  try {
    const response = await api.post("/configurations", config);
    return response.data;
  } catch (error) {
    console.error("Error updating configuration:", error);
    throw error;
  }
};
