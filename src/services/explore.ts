import api from "./api";
import type { ExploreResponse } from "@/types/explore";

export interface ExploreParams {
  limit: number;
  page: number;
}

export const getExplore = async (
  params: ExploreParams
): Promise<ExploreResponse> => {
  try {
    const response = await api.get("/explore", { params });
    return response.data;

  } catch (error) {
    console.error("Error fetching explore data:", error);
    throw error;
  }
};

export const getExploreSearch = async (
  q: string,
  params: ExploreParams
): Promise<ExploreResponse> => {
  try {
    const response = await api.get("/explore/search", {
      params: { ...params, q },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching explore search data:", error);
    throw error;
  }
};
