import axios from 'axios';

const API_BASE_URL = 'http://localhost:5048/api';

export interface ApplicationModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
}

export interface Application {
  id: string;
  name: string;
  subtitle?: string;
  appKey: string;
  webhookUrl: string;
  description: string;
  imageBase64: string;
  displayOrder: number;
  modules: ApplicationModule[];
}

export interface Plan {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular: boolean;
}

export const getApplications = async (): Promise<Application[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return [];
  }
};

export const getPlans = async (): Promise<Plan[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/plans`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return [];
  }
};
