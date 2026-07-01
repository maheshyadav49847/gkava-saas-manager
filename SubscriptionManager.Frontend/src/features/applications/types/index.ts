export interface Application {
  id: string;
  name: string;
  appKey: string;
  webhookUrl: string;
}

export interface CreateApplicationDTO {
  name: string;
  webhookUrl: string;
}
