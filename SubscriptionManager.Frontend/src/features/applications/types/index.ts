export interface ApplicationModule {
  id?: string;
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

export interface CreateApplicationDTO {
  name: string;
  subtitle?: string;
  webhookUrl: string;
  description: string;
  imageBase64: string;
  displayOrder: number;
  modules?: ApplicationModule[];
}

export interface UpdateApplicationDTO {
  id: string;
  name: string;
  subtitle?: string;
  webhookUrl: string;
  description: string;
  imageBase64: string;
  displayOrder: number;
  modules?: ApplicationModule[];
}
