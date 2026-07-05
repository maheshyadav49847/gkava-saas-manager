import { apiClient } from '@/lib/apiClient';
import { LoginDto, AuthResponseDto } from '../types';

export const loginApi = async (data: LoginDto): Promise<AuthResponseDto> => {
  const response = await apiClient.post<AuthResponseDto>('/auth/login', data);
  // apiClient interceptors return response.data directly, but in TS we might need to handle it properly
  // Since interceptor returns response.data, let's just return the response directly
  return response as unknown as AuthResponseDto;
};
