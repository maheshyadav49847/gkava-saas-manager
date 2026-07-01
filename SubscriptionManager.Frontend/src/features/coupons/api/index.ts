import { apiClient } from '../../../lib/apiClient';
import { CouponDto, CreateCouponDto, UpdateCouponDto } from '../types';

export const couponsApi = {
  getCoupons: async (): Promise<CouponDto[]> => {
    const response = await apiClient.get('/coupons');
    return response as unknown as CouponDto[];
  },

  createCoupon: async (data: CreateCouponDto): Promise<string> => {
    const response = await apiClient.post('/coupons', data);
    return response as unknown as string;
  },

  updateCoupon: async (id: string, data: UpdateCouponDto): Promise<void> => {
    await apiClient.put(`/coupons/${id}`, data);
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await apiClient.delete(`/coupons/${id}`);
  },

  validateCoupon: async (code: string): Promise<CouponDto> => {
    const response = await apiClient.get(`/coupons/validate/${code}`);
    return response as unknown as CouponDto;
  }
};
