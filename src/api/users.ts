import { api } from './axios';
import type { NicknameCheckRequest, NicknameCheckResponse } from '../types/api/users';

// 닉네임 중복검사 API
export const checkNicknameDuplicate = async (
  request: NicknameCheckRequest
): Promise<NicknameCheckResponse> => {
  const response = await api.post<NicknameCheckResponse>(
    '/users/nickname-check',
    {},
    {
      params: { nickname: request.nickname },
    }
  );
  return response.data;
};