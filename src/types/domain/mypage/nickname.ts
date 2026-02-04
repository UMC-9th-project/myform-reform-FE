export interface CheckNicknameResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: string | null;
  success: {
    isAvailable: boolean;
    nickname: string;
    message: string;
  } | null;
}