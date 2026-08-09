import { apiClient } from '../../../lib/apiClient';
import { UpdateProfileRequest, ChangePasswordRequest, PlatformSettingsDto } from '../types';
import { AuthResponseDto } from '../../auth/types';

export const updateProfile = async (data: UpdateProfileRequest): Promise<AuthResponseDto> => {
  const response = await apiClient.put('/profile', data);
  return response as unknown as AuthResponseDto;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await apiClient.put('/profile/password', data);
};

export const getPlatformSettings = async (): Promise<PlatformSettingsDto> => {
  const response = await apiClient.get('/admin/settings');
  return response as unknown as PlatformSettingsDto;
};

export const updatePlatformSettings = async (data: Omit<PlatformSettingsDto, 'id' | 'updatedAt'>): Promise<void> => {
  await apiClient.put('/admin/settings', data);
};
