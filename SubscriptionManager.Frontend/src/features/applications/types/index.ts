export interface Application {
  id: string;
  name: string;
  appKey: string;
  webhookUrl: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  badge?: string;
  isReady: boolean;
}

export interface CreateApplicationDTO {
  name: string;
  webhookUrl: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  badge?: string;
  isReady: boolean;
}
