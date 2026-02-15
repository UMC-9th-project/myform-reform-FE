import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signupReformer } from '../../../api/auth';
import { uploadImage, uploadImages } from '../../../api/upload';
import type { ReformerSignupRequest, SignupRequest } from '../../../types/api/auth';
import useAuthStore from '../../../stores/useAuthStore';

interface UseReformerSignupReturn {
  signup: (data: {
    signupData: SignupRequest;
    portfolioPhotos: File[];
    description: string;
    businessNumber?: string;
    redirectUrl?: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useReformerSignup = (): UseReformerSignupReturn => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();

  const { mutate: signupMutation, isPending: isLoading, error: mutationError } = useMutation({
    mutationFn: async (data: {
      signupData: SignupRequest;
      portfolioPhotos: File[];
      description: string;
      businessNumber?: string;
      redirectUrl?: string;
    }) => {
      // 1. 먼저 이미지 파일들을 업로드하여 URL 배열을 받아옴
      let portfolioPhotoUrls: string[] = [];
      
      if (data.portfolioPhotos.length > 0) {
        try {
          if (data.portfolioPhotos.length === 1) {
            // 단일 이미지 업로드
            const uploadResult = await uploadImage(data.portfolioPhotos[0]);
            if (uploadResult.resultType === 'SUCCESS' && uploadResult.success) {
              portfolioPhotoUrls = [uploadResult.success.url];
            } else {
              throw new Error('이미지 업로드 실패');
            }
          } else {
            // 여러 이미지 업로드
            const uploadResult = await uploadImages(data.portfolioPhotos);
            if (uploadResult.resultType === 'SUCCESS' && uploadResult.success) {
              portfolioPhotoUrls = uploadResult.success.url;
            } else {
              throw new Error('이미지 업로드 실패');
            }
          }
        } catch (error) {
          console.error('이미지 업로드 중 오류:', error);
          throw new Error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        }
      }

      // 2. 업로드된 URL 배열을 사용하여 회원가입 요청
      const requestData: ReformerSignupRequest = {
        data: data.signupData,
        portfolioPhotos: portfolioPhotoUrls, // URL 배열로 전달
        description: data.description,
        ...(data.businessNumber !== undefined ? { businessNumber: data.businessNumber } : {}),
      };
      return signupReformer(requestData);
    },
    onSuccess: (data, variables) => {
      if (data.resultType === 'SUCCESS' && data.success) {
        // 회원가입 성공 시 accessToken 저장
        if (data.success.accessToken) {
          setAccessToken(data.success.accessToken, 'reformer');
        }
        // redirectUrl이 있으면 해당 URL로 이동, 없으면 완료 페이지로 이동
        if (variables.redirectUrl) {
          navigate(variables.redirectUrl);
        } else {
          navigate('/signup/reformer-complete');
        }
      }
    },
    onError: (err) => {
      console.error('리폼러 회원가입 실패:', err);
      const axiosError = err as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            error?: {
              message?: string;
              code?: string;
            };
          };
        };
      };
      console.error('에러 상세:', JSON.stringify(axiosError.response?.data, null, 2));
      if (axiosError.response?.data?.error) {
        console.error('에러 메시지:', axiosError.response.data.error.message);
        console.error('에러 코드:', axiosError.response.data.error.code);
      }
    },
  });

  const signup: UseReformerSignupReturn['signup'] = async (data) => {
    return new Promise((resolve, reject) => {
      signupMutation(data, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  const error = mutationError
    ? (() => {
        const axiosError = mutationError as {
          response?: {
            status?: number;
            data?: {
              message?: string;
              error?: {
                message?: string;
                code?: string;
              };
            };
          };
        };

        // 400 에러: 입력 정보 오류
        if (axiosError.response?.status === 400) {
          return axiosError.response?.data?.error?.message ||
                 axiosError.response?.data?.message ||
                 '입력한 정보가 올바르지 않습니다.';
        }

        // 500 에러: 서버 오류
        if (axiosError.response?.status === 500) {
          return axiosError.response?.data?.error?.message ||
                 axiosError.response?.data?.message ||
                 '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }

        // 기타 에러
        return axiosError.response?.data?.error?.message ||
               axiosError.response?.data?.message ||
               '리폼러 회원가입에 실패했습니다. 다시 시도해주세요.';
      })()
    : null;

  return {
    signup,
    isLoading,
    error,
  };
};
