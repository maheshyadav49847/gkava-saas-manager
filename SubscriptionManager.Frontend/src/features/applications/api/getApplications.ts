import { apiClient } from "@/lib/apiClient";
import { Application } from "../types";

export const getApplications = async (): Promise<Application[]> => {
  const response = await apiClient.get<Application[]>("/applications");
  return response as unknown as Application[];
};
