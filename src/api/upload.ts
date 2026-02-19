import { api } from './axios';
import type {
  UploadSingleResponse,
  UploadManyResponse,
} from '../types/common/upload';

/** 이미지 1장 업로드 */
export const uploadImage = async (
  file: File
): Promise<UploadSingleResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post<UploadSingleResponse>(
    '/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data;
};

/** 이미지 여러 장 업로드 */
export const uploadImages = async (
  files: File[]
): Promise<UploadManyResponse> => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  const { data } = await api.post<UploadManyResponse>(
    '/upload/many',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data;
};
