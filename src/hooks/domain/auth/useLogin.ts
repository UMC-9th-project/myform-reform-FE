import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../../api/auth';
import type { LoginRequest } from '@/types/api/auth';
import useAuthStore from '../../../stores/useAuthStore';

interface UseLoginReturn {
  login: (data: LoginRequest) => void;
  isLoading: boolean;
  error: string | null;
}

export const useLogin = (): UseLoginReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuthStore();

  const userRole = location.pathname.includes('reformer') ? 'reformer' : 'user';

  const {
    mutate: loginMutation,
    isPending: isLoading,
    error: mutationError,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.resultType === 'SUCCESS' && data.success) {
        queryClient.removeQueries({ queryKey: ['wishlist'] });
        if (data.success.accessToken) {
          setAccessToken(data.success.accessToken, userRole);
        }
        navigate('/');
      }
    },
    onError: (err) => {
      const axiosError = err as {
        response?: {
          status?: number;
          data?: { error?: { errorCode?: string } };
        };
      };

      if (
        axiosError.response?.status === 403 &&
        axiosError.response?.data?.error?.errorCode === 'Auth_117'
      ) {
        navigate('/login/approval-pending');
        return;
      } else if (
        axiosError.response?.status === 403 &&
        axiosError.response?.data?.error?.errorCode === 'Auth_118'
      ) {
        navigate('/login/approval-rejected');
        return;
      }

      console.error('로그인 실패:', err);
    },
  });

  const login = (data: LoginRequest) => {
    loginMutation({
      ...data,
      role: userRole,
    });
  };

  const error = mutationError
    ? (() => {
        const axiosError = mutationError as {
          response?: {
            status?: number;
            data?: {
              message?: string;
              error?: { message?: string; errorCode?: string };
            };
          };
        };

        // 승인 대기 중이면 onError에서 navigate하므로 에러 메시지 미표시
        if (
          axiosError.response?.status === 403 &&
          axiosError.response?.data?.error?.errorCode === 'Auth_117'
        ) {
          return null;
        }

        if (
          axiosError.response?.status === 400 ||
          axiosError.response?.status === 401
        ) {
          return (
            axiosError.response?.data?.error?.message ||
            axiosError.response?.data?.message ||
            '이메일 또는 비밀번호가 올바르지 않습니다.'
          );
        }

        if (axiosError.response?.status === 500) {
          return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }

        return (
          axiosError.response?.data?.error?.message ||
          axiosError.response?.data?.message ||
          '로그인에 실패했습니다. 다시 시도해주세요.'
        );
      })()
    : null;

  return {
    login,
    isLoading,
    error,
  };
};
