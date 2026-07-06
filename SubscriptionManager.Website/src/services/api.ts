import axios from 'axios';

const API_BASE_URL = 'http://localhost:5048/api';

export interface Application {
  id: string;
  name: string;
  appKey: string;
  webhookUrl: string;
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
