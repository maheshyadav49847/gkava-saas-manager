export interface Plan {
  id: string;
  applicationId?: string;
  applicationName?: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular: boolean;
  createdAt?: string;
}

export interface CreatePlanDto {
  applicationId: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isPopular: boolean;
  features: string[];
}
