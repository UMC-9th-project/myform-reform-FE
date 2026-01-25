import { useState, useRef, useEffect } from 'react';

interface UsePhoneVerificationReturn {
  phoneTimerActive: boolean;
  phoneTimeLeft: number;
  startTimer: () => void;
  resetTimer: () => void;
}

export const usePhoneVerification = (
  initialTime: number = 180
): UsePhoneVerificationReturn => {
  const [phoneTimerActive, setPhoneTimerActive] = useState(false);
  const [phoneTimeLeft, setPhoneTimeLeft] = useState(initialTime);
  const phoneIntervalRef = useRef<number | null>(null);

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

  const startTimer = () => {
    setPhoneTimerActive(true);
    setPhoneTimeLeft(initialTime);
  };

  const resetTimer = () => {
    setPhoneTimerActive(false);
    setPhoneTimeLeft(initialTime);
    if (phoneIntervalRef.current) {
      window.clearInterval(phoneIntervalRef.current);
    }
  };

  return {
    phoneTimerActive,
    phoneTimeLeft,
    startTimer,
    resetTimer,
  };
};
