export interface AddToCartRequest {
  quantity: number;
  optionItemIds: string[]; // 필수 필드 (옵션이 없는 경우 빈 배열)
}

export interface AddToCartResponse {
  quantity: number;
  optionItemIds: string[];
}
