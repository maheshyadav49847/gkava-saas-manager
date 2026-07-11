import { apiClient } from "@/lib/apiClient";

export interface CreateApplicationDto {
  name: string;
  webhookUrl: string;
  description: string;
  imageBase64: string;
  features: string[];
}

export const createApplication = async (data: CreateApplicationDto): Promise<string> => {
  const response = await apiClient.post<string>("/applications", data);
  return response as unknown as string;
};
