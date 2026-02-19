import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { checkNicknameDuplicate } from '../../../api/users';

interface UseNicknameDuplicateReturn {
  isNicknameVerified: boolean;
  nicknameDuplicateError: boolean;
  verifyNickname: (nickname: string) => void;
  resetVerification: () => void;
  setDuplicateError: (error: boolean) => void;
  isLoading: boolean;
}

export const useNicknameDuplicate = (): UseNicknameDuplicateReturn => {
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [nicknameDuplicateError, setNicknameDuplicateError] = useState(false);

  // React Query mutation
  const { mutate: checkNickname, isPending: isLoading } = useMutation({
    mutationFn: checkNicknameDuplicate,
    onSuccess: (data) => {
      if (data.resultType === 'SUCCESS' && data.success) {
        if (data.success.isAvailable) {
          setIsNicknameVerified(true);
          setNicknameDuplicateError(false);
        } else {
          setIsNicknameVerified(false);
          setNicknameDuplicateError(true);
        }
      } else {
        setIsNicknameVerified(false);
        setNicknameDuplicateError(true);
      }
    },
    onError: () => {
      setIsNicknameVerified(false);
      setNicknameDuplicateError(true);
    },
  });

  const verifyNickname = (nickname: string) => {
    if (!nickname.trim()) {
      setNicknameDuplicateError(true);
      setIsNicknameVerified(false);
      return;
    }
    checkNickname({ nickname });
  };

  const resetVerification = () => {
    setIsNicknameVerified(false);
    setNicknameDuplicateError(false);
  };

  const setDuplicateError = (error: boolean) => {
    setNicknameDuplicateError(error);
    if (error) {
      setIsNicknameVerified(false);
    }
  };

  return {
    isNicknameVerified,
    nicknameDuplicateError,
    verifyNickname,
    resetVerification,
    setDuplicateError,
    isLoading,
  };
};
