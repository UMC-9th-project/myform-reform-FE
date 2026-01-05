import { useState, useRef, useEffect } from 'react';
import Input from '../../common/Input/Input';

import {
  emailSchema,
  passwordSchema,
  nicknameSchema,
  phoneSchema,
  verificationCodeSchema,
} from '../../../schemas/signup';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | null
  >(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [verificationCodeError, setVerificationCodeError] = useState<
    string | null
  >(null);

  const [nicknameDuplicateError, setNicknameDuplicateError] = useState(false);
  const [phoneTimerActive, setPhoneTimerActive] = useState(false);
  const [phoneTimeLeft, setPhoneTimeLeft] = useState(180);
  const [verificationTimerActive, setVerificationTimerActive] = useState(false);
  const [verificationTimeLeft, setVerificationTimeLeft] = useState(180);
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [isVerificationCodeVerified, setIsVerificationCodeVerified] =
    useState(false);

  const phoneIntervalRef = useRef<number | null>(null);
  const verificationIntervalRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (verificationTimerActive && verificationTimeLeft > 0) {
      verificationIntervalRef.current = window.setInterval(() => {
        setVerificationTimeLeft((prev) => {
          if (prev <= 1) {
            setVerificationTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (verificationIntervalRef.current) {
        window.clearInterval(verificationIntervalRef.current);
      }
    };
  }, [verificationTimerActive, verificationTimeLeft]);

  const validateField = (
    value: string,
    schema: typeof emailSchema,
    setError: (error: string | null) => void,
    required = false
  ): boolean => {
    if (value.trim() === '') {
      if (required) {
        setError('필수 입력 항목입니다.');
        return false;
      }
      setError(null);
      return true;
    }

    const result = schema.safeParse(value);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return false;
    } else {
      setError(null);
      return true;
    }
  };

  // 전체 폼 유효성 검사
  const validateForm = () => {
    let isValid = true;

    // 각 필드 검증 (필수 필드는 required: true)
    if (!validateField(email, emailSchema, setEmailError, true)) {
      isValid = false;
    }

    if (!validateField(password, passwordSchema, setPasswordError, true)) {
      isValid = false;
    }

    if (!passwordConfirm.trim()) {
      setPasswordConfirmError('비밀번호를 한번 더 입력해주세요.');
      isValid = false;
    } else if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호를 동일하게 입력해주세요.');
      isValid = false;
    }

    if (!validateField(nickname, nicknameSchema, setNicknameError, true)) {
      isValid = false;
    }

    if (!validateField(phone, phoneSchema, setPhoneError, true)) {
      isValid = false;
    }

    if (
      !validateField(
        verificationCode,
        verificationCodeSchema,
        setVerificationCodeError,
        true
      )
    ) {
      isValid = false;
    }

    // 추가 검증: 닉네임 중복 확인
    if (!isNicknameVerified && nickname.trim()) {
      setNicknameDuplicateError(true);
      isValid = false;
    }

    // 추가 검증: 인증코드 확인
    if (!isVerificationCodeVerified && verificationCode.trim()) {
      setVerificationCodeError('인증코드를 확인해주세요.');
      isValid = false;
    }

    return isValid;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateField(value, emailSchema, setEmailError, false);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validateField(value, passwordSchema, setPasswordError, false);

    if (passwordConfirm) {
      if (value !== passwordConfirm) {
        setPasswordConfirmError('비밀번호를 동일하게 입력해주세요.');
      } else {
        setPasswordConfirmError(null);
      }
    }
  };

  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    if (value !== password) {
      setPasswordConfirmError('비밀번호를 동일하게 입력해주세요.');
    } else {
      setPasswordConfirmError(null);
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    validateField(value, nicknameSchema, setNicknameError, false);
    setNicknameDuplicateError(false);
    setIsNicknameVerified(false);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    validateField(value, phoneSchema, setPhoneError, false);
  };

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCode(value);
    validateField(
      value,
      verificationCodeSchema,
      setVerificationCodeError,
      false
    );
    setIsVerificationCodeVerified(false);
  };

  const handlePhoneVerificationRequest = () => {
    if (!phoneError && phone) {
      setPhoneTimerActive(true);
      setPhoneTimeLeft(180);

      setVerificationTimerActive(true);
      setVerificationTimeLeft(180);
    }
  };

  const handleNicknameDuplicateCheck = () => {
    if (!nicknameError && nickname.trim()) {
      setIsNicknameVerified(true);
      setNicknameDuplicateError(false);
    }
  };

  const handleVerificationCodeCheck = () => {
    if (!verificationCodeError && verificationCode.trim()) {
      setIsVerificationCodeVerified(true);
      setVerificationCodeError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 전체 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-6 max-w-[600px]"
    >
      <Input
        type="email"
        label="이메일"
        required
        placeholder="이메일을 입력해주세요."
        value={email}
        schema={emailSchema}
        error={emailError}
        onChange={handleEmailChange}
      />

      <Input
        type="password"
        label="비밀번호"
        required
        placeholder="영문, 숫자, 특수문자가 들어간 8자 이상으로 조합해주세요."
        value={password}
        schema={passwordSchema}
        error={passwordError}
        showPasswordToggle
        onChange={handlePasswordChange}
      />

      <Input
        type="password"
        placeholder="비밀번호를 한번 더 입력해주세요."
        value={passwordConfirm}
        error={passwordConfirmError}
        showPasswordToggle
        onChange={handlePasswordConfirmChange}
      />

      <Input
        type="text"
        label="닉네임"
        required
        placeholder="닉네임을 입력해주세요. (10자 이내)"
        value={nickname}
        schema={nicknameSchema}
        error={
          nicknameDuplicateError
            ? '사용할 수 없는 닉네임입니다.'
            : nicknameError
        }
        showButton
        buttonText="중복확인"
        onButtonClick={handleNicknameDuplicateCheck}
        onChange={handleNicknameChange}
      />

      <Input
        type="tel"
        label="전화번호"
        required
        placeholder="-를 제외한 숫자만 입력해주세요."
        value={phone}
        schema={phoneSchema}
        error={phoneError}
        timerSeconds={phoneTimerActive ? phoneTimeLeft : null}
        showButton
        buttonText="인증요청"
        onButtonClick={handlePhoneVerificationRequest}
        onChange={handlePhoneChange}
      />

      <Input
        type="text"
        placeholder="인증코드를 입력해주세요."
        value={verificationCode}
        schema={verificationCodeSchema}
        error={verificationCodeError}
        timerSeconds={verificationTimerActive ? verificationTimeLeft : null}
        showButton
        buttonText="확인"
        onButtonClick={handleVerificationCodeCheck}
        onChange={handleVerificationCodeChange}
      />
    </form>
  );
}
