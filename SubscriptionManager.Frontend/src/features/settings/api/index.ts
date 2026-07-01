import { apiClient } from '../../../lib/apiClient';
import { UpdateProfileRequest, ChangePasswordRequest } from '../types';
import { AuthResponseDto } from '../../auth/types';

export const updateProfile = async (data: UpdateProfileRequest): Promise<AuthResponseDto> => {
  const response = await apiClient.put('/profile', data);
  return response as unknown as AuthResponseDto;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await apiClient.put('/profile/password', data);
};
