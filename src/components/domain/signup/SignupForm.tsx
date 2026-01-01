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
    setError: (error: string | null) => void
  ) => {
    if (value.trim() === '') {
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

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateField(value, emailSchema, setEmailError);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validateField(value, passwordSchema, setPasswordError);

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
    validateField(value, nicknameSchema, setNicknameError);
    setNicknameDuplicateError(false);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    validateField(value, phoneSchema, setPhoneError);
  };

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCode(value);
    validateField(value, verificationCodeSchema, setVerificationCodeError);
  };

  const handlePhoneVerificationRequest = () => {
    if (!phoneError && phone) {
      setPhoneTimerActive(true);
      setPhoneTimeLeft(180);

      setVerificationTimerActive(true);
      setVerificationTimeLeft(180);
    }
  };

  return (
    <div className="flex flex-col gap-[1.5rem] p-6 max-w-[600px]">
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
        disabled={!nickname || !!nicknameError}
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
        disabled={!phone || !!phoneError}
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
        disabled={!verificationCode || !!verificationCodeError}
        onChange={handleVerificationCodeChange}
      />
    </div>
  );
}
