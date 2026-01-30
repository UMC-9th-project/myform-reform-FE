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
