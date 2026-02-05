import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { signupUser } from '../../../api/auth';
import type { SignupRequest } from '../../../types/api/auth';
import useAuthStore from '../../../stores/useAuthStore';

interface UseSignupReturn {
  signup: (data: SignupRequest) => void;
  isLoading: boolean;
  error: string | null;
}

export const useSignup = (): UseSignupReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken } = useAuthStore();

  // 현재 경로가 리폼러 회원가입인지 확인
  const isReformerSignup = location.pathname.includes('reformer-form');

  const { mutate: signupMutation, isPending: isLoading, error: mutationError } = useMutation({
    mutationFn: signupUser,
    onSuccess: (data, variables) => {
      if (data.resultType === 'SUCCESS' && data.success) {
        // 회원가입 성공 시 accessToken 저장
        if (data.success.accessToken) {
          setAccessToken(data.success.accessToken, 'user');
        }
        // 일반 사용자 회원가입 완료 페이지로 이동
        navigate('/signup/complete', {
          state: {
            nickname: variables.nickname,
          },
        });
      }
    },
    onError: (err) => {
      console.error('회원가입 실패:', err);
    },
  });

  const signup = (data: SignupRequest) => {
    // 리폼러 회원가입인 경우 API 호출하지 않고 바로 다음 페이지로 이동
    if (isReformerSignup) {
      navigate('/signup/reformer-registration', {
        state: {
          signupData: data, // 전체 회원가입 정보 전달
        },
      });
      return;
    }
    
    // 일반 사용자 회원가입인 경우 API 호출
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
               '회원가입에 실패했습니다. 다시 시도해주세요.';
      })()
    : null;

  return {
    signup,
    isLoading,
    error,
  };
};
