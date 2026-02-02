export interface NicknameCheckRequest {
  nickname: string;
}

export interface NicknameCheckResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    isAvailable: boolean;
  } | null;
}