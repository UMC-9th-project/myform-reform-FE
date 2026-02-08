import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../api/auth';
import useAuthStore from '../../../stores/useAuthStore';

interface UseLogoutReturn {
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useLogout = (): UseLogoutReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  const { mutate: logoutMutation, isPending: isLoading, error: mutationError } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['wishlist'] });
      clearAuth();
      navigate('/');
    },
    onError: () => {
      queryClient.removeQueries({ queryKey: ['wishlist'] });
      clearAuth();
      navigate('/');
    },
  });

  const logout = () => {
    logoutMutation();
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
              };
            };
          };
        };
        
        return axiosError.response?.data?.error?.message ||
               axiosError.response?.data?.message ||
               '로그아웃에 실패했습니다.';
      })()
    : null;

  return {
    logout,
    isLoading,
    error,
  };
};
