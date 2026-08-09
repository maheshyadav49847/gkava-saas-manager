export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PlatformSettingsDto {
  id: string;
  supportEmail: string;
  privacyEmail: string;
  legalEmail: string;
  contactPhone: string;
  updatedAt: string;
}
