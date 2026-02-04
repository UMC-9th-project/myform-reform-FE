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
