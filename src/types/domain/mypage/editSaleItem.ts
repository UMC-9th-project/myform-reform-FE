// api/profile/editSaleItem.ts
import { api } from '@/api/axios';

// 옵션의 하위 항목
export interface SaleSubOption {
  comment: string;      // 옵션 설명
  price: number;        // 옵션 가격
  quantity: number;     // 옵션 수량
  sortOrder: number;    // 순서
}

// 옵션 그룹
export interface SaleOptionGroup {
  title: string;              // 옵션 그룹 제목
  content: SaleSubOption[];   // 하위 옵션 배열
  sortOrder: number;          // 순서
}

// 카테고리
export interface SaleCategory {
  major: string;  // 대분류
  sub: string;    // 소분류
}

// 판매 상품 수정 요청
export interface EditSaleItemRequest {
  imageUrls: string[];          // 이미지 URL 배열
  title: string;                // 상품 제목
  content: string;              // 상품 설명
  price: number;                // 상품 가격
  delivery: number;             // 배송비
  option: SaleOptionGroup[];    // 옵션 그룹 배열
  category: SaleCategory;       // 카테고리
}

// API 호출 함수
export const editSaleItem = (itemId: string, payload: EditSaleItemRequest) => {
  return api.patch(`/profile/item/${itemId}`, payload);
};
