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
