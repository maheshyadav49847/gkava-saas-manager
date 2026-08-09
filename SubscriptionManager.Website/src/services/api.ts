import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const hostParts = window.location.hostname.split('.');
if (hostParts[0] === 'www') hostParts.shift();
const appDomain = `app.${hostParts.join('.')}`;
const dynamicApiUrl = `https://${appDomain}/api`;

const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5048/api' : dynamicApiUrl);

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

export interface PlatformSettings {
  id: string;
  supportEmail: string;
  privacyEmail: string;
  legalEmail: string;
  contactPhone: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  displayOrder: number;
}

let cachedApplications: Application[] | null = null;
let cachedPlans: Plan[] | null = null;
let cachedPlatformSettings: PlatformSettings | null = null;

export const getApplications = async (): Promise<Application[]> => {
  if (cachedApplications) return cachedApplications;
  try {
    const response = await axios.get(`${API_BASE_URL}/Website/applications`);
    cachedApplications = response.data;
    return response.data;
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return [];
  }
};

export const getPlans = async (): Promise<Plan[]> => {
  if (cachedPlans) return cachedPlans;
  try {
    const response = await axios.get(`${API_BASE_URL}/Website/plans`);
    cachedPlans = response.data;
    return response.data;
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return [];
  }
};

export const getPlatformSettings = async (): Promise<PlatformSettings | null> => {
  if (cachedPlatformSettings) return cachedPlatformSettings;
  try {
    const response = await axios.get(`${API_BASE_URL}/Website/contact-settings`);
    cachedPlatformSettings = response.data;
    return response.data;
  } catch (error) {
    console.error('Failed to fetch platform settings:', error);
    return null;
  }
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Website/team-members`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return [];
  }
};

export const registerSubscriber = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/SubscriberAuth/register`, data);
  return response.data;
};

export const loginSubscriber = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/SubscriberAuth/login`, data);
  return response.data;
};

export const getSubscriberDashboard = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/SubscriberDashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const subscribeToPlan = async (planId: string, token: string) => {
  const response = await axios.post(`${API_BASE_URL}/SubscriberDashboard/subscribe`, 
    { planId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const unsubscribeFromPlan = async (subscriptionId: string, token: string) => {
  const response = await axios.post(`${API_BASE_URL}/SubscriberDashboard/unsubscribe/${subscriptionId}`, 
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
