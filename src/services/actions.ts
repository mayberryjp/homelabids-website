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

export const acknowledgeAction = async (action_id: number) => {
  try {
    const response = await api.put(`/actions/${action_id}/acknowledge`, {
      acknowledged: 1,
    });
    return response.data;
  } catch (error) {
    console.error(`Error acknowledging action ${action_id}:`, error);
    throw error;
  }
};
