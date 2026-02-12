import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signupReformer } from '../../../api/auth';
import type { ReformerSignupRequest, SignupRequest } from '../../../types/api/auth';
import useAuthStore from '../../../stores/useAuthStore';

interface UseReformerSignupReturn {
  signup: (data: {
    signupData: SignupRequest;
    portfolioPhotos: File[];
    description: string;
    businessNumber: string;
  }) => void;
  isLoading: boolean;
  error: string | null;
}

export const useReformerSignup = (): UseReformerSignupReturn => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();

  const { mutate: signupMutation, isPending: isLoading, error: mutationError } = useMutation({
    mutationFn: (data: {
      signupData: SignupRequest;
      portfolioPhotos: File[];
      description: string;
      businessNumber?: string;
    }) => {
      const requestData: ReformerSignupRequest = {
        data: data.signupData,
        portfolioPhotos: data.portfolioPhotos,
        description: data.description,
        ...(data.businessNumber ? { businessNumber: data.businessNumber } : {}),
      };
      return signupReformer(requestData);
    },
    onSuccess: (data) => {
      if (data.resultType === 'SUCCESS' && data.success) {
        // 회원가입 성공 시 accessToken 저장
        if (data.success.accessToken) {
          setAccessToken(data.success.accessToken, 'reformer');
        }
        // 리폼러 회원가입 완료 페이지로 이동
        navigate('/signup/reformer-complete');
      }
    },
    onError: (err) => {
      console.error('리폼러 회원가입 실패:', err);
    },
  });

  const signup = (data: {
    signupData: SignupRequest;
    portfolioPhotos: File[];
    description: string;
    businessNumber?: string;
  }) => {
    signupMutation(data);
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
