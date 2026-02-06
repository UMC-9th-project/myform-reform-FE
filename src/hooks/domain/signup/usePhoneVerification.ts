import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendSmsVerification, verifySmsCode } from '../../../api/auth';

interface UsePhoneVerificationReturn {
  phoneTimerActive: boolean;
  phoneTimeLeft: number;
  sendSms: (phoneNumber: string) => void;
  verifyCode: (phoneNumber: string, code: string, onSuccess?: () => void) => void;
  resetTimer: () => void;
  isLoading: boolean;
  isVerifying: boolean;
  error: string | null;
  isVerified: boolean;
}

export const usePhoneVerification = (
  initialTime: number = 180
): UsePhoneVerificationReturn => {
  const [phoneTimerActive, setPhoneTimerActive] = useState(false);
  const [phoneTimeLeft, setPhoneTimeLeft] = useState(initialTime);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const phoneIntervalRef = useRef<number | null>(null);

  // SMS 전송 mutation
  const { mutate: sendSmsMutation, isPending: isLoading } = useMutation({
    mutationFn: sendSmsVerification,
    onSuccess: (data) => {
      if (data.resultType === 'SUCCESS' && data.success) {
        // SMS 전송 성공 시 타이머 시작
        setPhoneTimerActive(true);
        setPhoneTimeLeft(initialTime);
        setError(null);
      } else {
        setError(data.error?.message || 'SMS 전송에 실패했습니다. 다시 시도해주세요.');
      }
    },
    onError: (err) => {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'SMS 전송에 실패했습니다. 다시 시도해주세요.'
      );
    },
  });

  useEffect(() => {
    if (phoneTimerActive && phoneTimeLeft > 0) {
      phoneIntervalRef.current = window.setInterval(() => {
        setPhoneTimeLeft((prev) => {
          if (prev <= 1) {
            setPhoneTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (phoneIntervalRef.current) {
        window.clearInterval(phoneIntervalRef.current);
      }
    };
  }, [phoneTimerActive, phoneTimeLeft]);

  // SMS 인증코드 검증 mutation
  const { mutate: verifyCodeMutation, isPending: isVerifying } = useMutation({
    mutationFn: verifySmsCode,
  });

  const sendSms = (phoneNumber: string) => {
    if (!phoneNumber.trim()) {
      setError('전화번호를 입력해주세요.');
      return;
    }
    setError(null);
    setIsVerified(false); // 새 인증코드 발송 시 검증 상태 리셋
    sendSmsMutation({ phoneNumber });
  };

  const verifyCode = (phoneNumber: string, code: string, onSuccess?: () => void) => {
    if (!phoneNumber.trim() || !code.trim()) {
      setError('전화번호와 인증코드를 입력해주세요.');
      return;
    }
    setError(null);
    verifyCodeMutation(
      { phoneNumber, code },
      {
        onSuccess: (data) => {
          // 훅의 onSuccess에서 상태 업데이트
          if (data.resultType === 'SUCCESS' && data.success) {
            setIsVerified(true);
            setError(null);
            setPhoneTimerActive(false);
            // 외부 콜백 호출
            if (onSuccess) {
              onSuccess();
            }
          } else {
            setIsVerified(false);
            setError(data.error?.message || '인증코드가 일치하지 않습니다. 다시 확인해주세요.');
          }
        },
        onError: (err) => {
          setIsVerified(false);
          setError(
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || '인증코드 검증에 실패했습니다. 다시 시도해주세요.'
          );
        },
      }
    );
  };

  const resetTimer = () => {
    setPhoneTimerActive(false);
    setPhoneTimeLeft(initialTime);
    setError(null);
    setIsVerified(false);
    if (phoneIntervalRef.current) {
      window.clearInterval(phoneIntervalRef.current);
    }
  };

  return {
    phoneTimerActive,
    phoneTimeLeft,
    sendSms,
    verifyCode,
    resetTimer,
    isLoading,
    isVerifying,
    error,
    isVerified,
  };
};
