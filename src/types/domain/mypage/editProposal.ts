
export interface ReformProposalImage {
  photo_order: number;
  photo: string;
}

export interface ReformProposalProfile {
  bio: string;
  keywords: string[];
  totalSaleCount: number;
  reviewCount: number;
  avgStarRecent3m: number;
  avgStar: number;
  ownerProfile: string;
  ownerName: string;
}

export interface ReformProposalResponse {
  reformProposalId: string;
  isOwner: boolean;
  isWished: boolean;
  ownerId: string;
  title: string;
  price: number;
  delivery: number;
  expectedWorking: number;
  images: ReformProposalImage[];
  content: string;
  profile: ReformProposalProfile;
  category?: {
    major: string;
    sub?: string;
  };
}

export interface EditReformProposalRequest {
  images: string[];               // 업로드된 이미지 URL 배열
  title: string;                  // 글 제목
  contents: string;               // 상세 내용
  price: number;                  // 가격
  delivery: number;               // 배송비
  expectedWorking: number;        // 예상 작업 기간(일 단위)
  category: {
    major: string;                // 대분류
    sub: string;                  // 소분류
  };
}
