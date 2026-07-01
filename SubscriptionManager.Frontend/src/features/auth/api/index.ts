import axios from 'axios';
import { LoginDto, AuthResponseDto } from '../types';

export const loginApi = async (data: LoginDto): Promise<AuthResponseDto> => {
  // Use a raw axios call here to avoid circular dependency with interceptors if needed
  // But we can use the regular api client as well, it will just not have a token.
  const response = await axios.post<AuthResponseDto>('https://localhost:5056/api/auth/login', data);
  return response.data;
};
