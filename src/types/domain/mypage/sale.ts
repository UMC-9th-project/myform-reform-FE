
// --- 판매글 조회 응답 타입 ---
export interface SaleItemResponse {
  item_id: string;
  title: string;
  images: string[];
  price: number;
  content: string;
  delivery: number;
  delivery_info?: string;
  option_groups: SaleOptionGroupResponse[];
  reformer: ReformerInfo;
  is_wished: boolean;
  review_summary?: ReviewSummary;
  reviews?: Review[];
  category: SaleCategory;
}

export interface SaleOptionGroupResponse {
  option_group_id: string;
  name: string;
  option_items: SaleOptionItemResponse[];
}

export interface SaleOptionItemResponse {
  option_item_id: string;
  name: string;
  extra_price: number;
  quantity: number;
  is_sold_out: boolean;
}

export interface ReformerInfo {
  owner_id: string;
  profile_image: string;
  nickname: string;
  star: number;
  star_recent_3m: number;
  order_count: number;
}

export interface ReviewSummary {
  total_review_count: number;
  photo_review_count: number;
  avg_star: number;
  preview_photos: {
    photo_index: number;
    review_id: string;
    photo_url: string;
  }[];
  remaining_photo_count: number;
}

export interface Review {
  review_id: string;
  user_profile_image: string;
  user_nickname: string;
  star: number;
  created_at: string;
  content: string;
  product_thumbnail?: string;
  photos?: string[];
}

// --- 클라이언트에서 사용할 이미지 타입 ---
export type ImageType = {
  file: File | null; // 새로 업로드한 파일이면 File, 기존 이미지면 null
  preview: string;   // 이미지 URL 혹은 로컬 Blob URL
};

export interface CreateSaleRequest {
  title: string;
  content: string;
  price: number;
  delivery: number;
  option: SaleOption[];
  category: SaleCategory;
  imageUrls: string[];
}

export interface SaleOptionItem {
  comment: string;
  price: number;
  quantity: number;
  sortOrder: number;
}

export interface SaleOption {
  title: string;
  content: SaleOptionItem[];
  sortOrder: number;
}

export interface SaleCategory {
  major: string;
  sub: string;
}
