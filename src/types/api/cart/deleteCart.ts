export interface DeleteCartRequest {
  cartIds: string[];
}

export interface DeleteCartResponse {
  resultType: string;
  error: null;
  success: string;
}
