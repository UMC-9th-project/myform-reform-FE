// 닉네임 중복검사 요청 타입
export interface NicknameCheckRequest {
  nickname: string;
}

// 닉네임 중복검사 응답 타입
export interface NicknameCheckResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    isAvailable: boolean;
    nickname: string;
    message: string;
  } | null;
}