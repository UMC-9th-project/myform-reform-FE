export interface CreateOrderRequest {
  title: string;
  content: string;
  price: number;
  delivery: number;
  expected_working: number;
  category: {
    major: string;
    sub: string;
  };
  imageUrls: string[];
}