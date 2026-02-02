import { api } from './axios';
import type { NicknameCheckRequest, NicknameCheckResponse } from '../types/api/users';

export const checkNicknameDuplicate = async (
  request: NicknameCheckRequest
): Promise<NicknameCheckResponse> => {
  const response = await api.post<NicknameCheckResponse>(
    '/users/nickname-check',
    request
  );
  return response.data;
};