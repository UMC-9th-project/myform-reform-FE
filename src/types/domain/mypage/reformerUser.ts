// types/user.ts
export interface UserProfile {
  profileImageUrl: string | null;
  nickname: string;
  bio: string;
  keywords: string[];
}

// 요청 바디
export interface UpdateUserProfileRequest {
  profileImageUrl?: string; // 이미지 파일
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

export interface GetMyReformerInfoResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: { data: string; reason: string; errorCode: string } | null;
  success: {
    userId: string;
    role: string;
    email: string;
    name: string;
    nickname: string;
    phone: string;
    profileImageUrl: string | null;
    averageRating: number;
    keywords: string[];
    bio: string;
    reviewCount: number;
    totalSales: number;
  } | null;
}

export interface GetMyUserInfoResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: {
    data: string;
    reason: string;
    errorCode: string;
  } | null;
  success: {
    userId: string;
    role: 'user' | 'reformer';
    email: string;
    name: string;
    nickname: string;
    phone: string;
    profileImageUrl: string | null;
  } | null;
}
