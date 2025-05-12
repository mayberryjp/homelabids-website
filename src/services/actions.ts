import api from "./api";

export const getActions = async () => {
  try {
    const response = await api.get("/actions");
    return response.data;
  } catch (error) {
    console.error("Error fetching actions:", error);
    throw error;
  }
};

export const acknowledgeAction = async (actionId: string | number) => {
  try {
    const response = await api.put(`/actions/${actionId}`, {
      acknowledged: 0,
    });
    return response.data;
  } catch (error) {
    console.error("Error acknowledging action:", error);
    throw error;
  }
};
