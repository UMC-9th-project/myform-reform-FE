import { api } from './axios';
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse, LogoutResponse, SmsSendRequest, SmsSendResponse, SmsVerifyRequest, SmsVerifyResponse, ReformerSignupRequest } from '../types/api/auth';


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

// 리폼러 회원가입 API (multipart/form-data)
export const signupReformer = async (
  data: ReformerSignupRequest
): Promise<SignupResponse> => {
  const formData = new FormData();
  
  // data를 JSON 문자열로 직렬화
  // description과 businessNumber를 data 객체에 포함
  // businessNumber가 빈 값이거나 undefined면 포함하지 않음
  const signupData: SignupRequest & { description: string; businessNumber?: string } = {
    ...data.data,
    description: data.description,
  };
  
  // businessNumber가 있고 빈 문자열이 아닐 때만 추가 (- 포함 형식)
  if (data.businessNumber && data.businessNumber.trim().length > 0) {
    signupData.businessNumber = data.businessNumber.trim();
  }
  
  formData.append('data', JSON.stringify(signupData));
  
  // portfolioPhotos 파일들 추가 (스펙에 맞게 필드명 변경)
  data.portfolioPhotos.forEach((file) => {
    formData.append('portfolioPhotos', file);
  });

  const response = await api.post<SignupResponse>(
    '/auth/signup/reformer',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};