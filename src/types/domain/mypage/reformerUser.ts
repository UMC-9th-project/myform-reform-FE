// types/user.ts
export interface UserProfile {
  profileImageUrl: string | null;
  nickname: string;
  bio: string;
  keywords: string[];
}

// 요청 바디
export interface UpdateUserProfileRequest {
  profileImage?: string; // 이미지 파일
  nickname: string;
  bio: string;
  keywords: string[];
}

// 응답
export interface UpdateUserProfileResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: string | null;
  success: UserProfile | null;
}
