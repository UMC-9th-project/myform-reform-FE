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
