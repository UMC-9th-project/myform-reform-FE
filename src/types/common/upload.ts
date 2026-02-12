// 이미지 한장 업로드
export interface UploadSingleResponse {
  resultType: string;
  error: null | unknown;
  success: {
    url: string;
  };
}

// 이미지 여러장 업로드
export interface UploadManyResponse {
  resultType: string;
  error: null | unknown;
  success: {
    url: string[];
  };
}
