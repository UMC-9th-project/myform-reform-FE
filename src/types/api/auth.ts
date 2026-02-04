// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
  role: 'user' | 'reformer';
}

// 로그인 응답 타입
export interface LoginResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    accessToken: string;
  } | null;
}

// 로그아웃 응답 타입
export interface LogoutResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    statusCode: number;
    message: string;
  } | null;
}


export interface SignupRequest {
  name: string;
  email: string;
  nickname: string;
  phoneNumber: string;
  registration_type: 'LOCAL';
  oauthId: string;
  password: string;
  over14YearsOld: boolean;
  termsOfService: boolean;
  privacyPolicy: boolean;
}

export interface SignupResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    accessToken: string;
  } | null;
}

// SMS 전송 요청 타입
export interface SmsSendRequest {
  phoneNumber: string;
}

// SMS 전송 응답 타입
export interface SmsSendResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    statusCode: number;
    message: string;
  } | null;
}

// SMS 인증코드 검증 요청 타입
export interface SmsVerifyRequest {
  phoneNumber: string;
  code: string;
}

// SMS 인증코드 검증 응답 타입
export interface SmsVerifyResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    statusCode: number;
    message: string;
  } | null;
}
