import { useState } from 'react';

interface UseNicknameDuplicateReturn {
  isNicknameVerified: boolean;
  nicknameDuplicateError: boolean;
  verifyNickname: () => void;
  resetVerification: () => void;
  setDuplicateError: (error: boolean) => void;
}

export const useNicknameDuplicate = (): UseNicknameDuplicateReturn => {
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [nicknameDuplicateError, setNicknameDuplicateError] = useState(false);

  const verifyNickname = () => {
    setIsNicknameVerified(true);
    setNicknameDuplicateError(false);
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
  };
};
