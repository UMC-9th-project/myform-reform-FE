import { api } from './axios';
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse, LogoutResponse, SmsSendRequest, SmsSendResponse, SmsVerifyRequest, SmsVerifyResponse } from '../types/api/auth';


// 일반 사용자 회원가입 API
export const signupUser = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>(
    '/auth/signup/user',
    data
  );
  return response.data;
};




export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/login/local',  
    data
  );
  return response.data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/auth/logout');
  return response.data;
};

// SMS 인증코드 전송 API
export const sendSmsVerification = async (
  data: SmsSendRequest
): Promise<SmsSendResponse> => {
  const response = await api.post<SmsSendResponse>(
    '/auth/sms/send',
    data
  );
  return response.data;
};

// SMS 인증코드 검증 API
export const verifySmsCode = async (
  data: SmsVerifyRequest
): Promise<SmsVerifyResponse> => {
  const response = await api.post<SmsVerifyResponse>(
    '/auth/sms/verify',
    data
  );
  return response.data;
};