export interface AuthResponseDto {
  token: string;
  name: string;
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
