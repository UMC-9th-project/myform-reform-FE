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

// 카카오 로그인 시작
// API: GET /myform_reform/api/v1/auth/kakao?mode={user|reformer}&redirectUrl={로그인 후 이동할 상대 주소}
export const startKakaoLogin = (mode: 'user' | 'reformer', redirectUrl?: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const params = new URLSearchParams({
    mode,
  });
  // redirectUrl은 선택 사항 (API 문서에 따르면 선택 사항)
  if (redirectUrl) {
    params.append('redirectUrl', redirectUrl);
  }
  
  const kakaoLoginUrl = `${baseUrl}/auth/kakao?${params.toString()}`;
  
  // 디버깅: 실제 이동할 URL 확인
  console.log('카카오 로그인 URL:', kakaoLoginUrl);
  console.log('Base URL:', baseUrl);
  console.log('Mode:', mode);
  console.log('Redirect URL:', redirectUrl || '(없음)');
  
  window.location.href = kakaoLoginUrl;
};

// 리폼러 회원가입 API
export const signupReformer = async (
  data: ReformerSignupRequest
): Promise<SignupResponse> => {
  // 일반 유저 가입 정보 + 리폼러 추가 정보를 하나의 객체로 구성
  const requestBody: SignupRequest & { 
    description: string; 
    businessNumber?: string;
    portfolioPhotos: string[]; // URL 배열로 포함
  } = {
    ...data.data,
    description: data.description,
    portfolioPhotos: data.portfolioPhotos, // URL 배열 추가
  };
  
  // businessNumber가 undefined가 아닐 때는 항상 포함 (빈 문자열이어도 전송)
  if (data.businessNumber !== undefined) {
    requestBody.businessNumber = data.businessNumber.trim();
  }

  const response = await api.post<SignupResponse>(
    '/auth/signup/reformer',
    requestBody
  );
  return response.data;
};