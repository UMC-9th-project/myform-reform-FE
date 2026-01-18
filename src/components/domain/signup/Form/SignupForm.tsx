import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/button1';
import AgreementSection from '../AgreementSection';
import {
  emailSchema,
  passwordSchema,
  nicknameSchema,
  phoneSchema,
} from '../../../../schemas/signup';

export default function SignupForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | null
  >(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [nicknameDuplicateError, setNicknameDuplicateError] = useState(false);
  const [phoneTimerActive, setPhoneTimerActive] = useState(false);
  const [phoneTimeLeft, setPhoneTimeLeft] = useState(180);
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeServiceTerms, setAgreeServiceTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

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

    if (!isNicknameVerified && nickname.trim()) {
      setNicknameDuplicateError(true);
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

  const handlePhoneVerificationRequest = () => {
    if (!phoneError && phone) {
      setPhoneTimerActive(true);
      setPhoneTimeLeft(180);
    }
  };

  const handleNicknameDuplicateCheck = () => {
    if (!nicknameError && nickname.trim()) {
      setIsNicknameVerified(true);
      setNicknameDuplicateError(false);
    }
  };

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeAge(checked);
    setAgreeServiceTerms(checked);
    setAgreePrivacy(checked);
  };

  const handleAgreeAge = (checked: boolean) => {
    setAgreeAge(checked);
    updateAgreeAll(checked, agreeServiceTerms, agreePrivacy);
  };

  const handleAgreeServiceTerms = (checked: boolean) => {
    setAgreeServiceTerms(checked);
    updateAgreeAll(agreeAge, checked, agreePrivacy);
  };

  const handleAgreePrivacy = (checked: boolean) => {
    setAgreePrivacy(checked);
    updateAgreeAll(agreeAge, agreeServiceTerms, checked);
  };

  const updateAgreeAll = (age: boolean, service: boolean, privacy: boolean) => {
    setAgreeAll(age && service && privacy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!agreeAge || !agreeServiceTerms) {
      return;
    }
    navigate('/signup/complete', { state: { nickname } });
  };

  const isFormValid =
    !emailError &&
    !passwordError &&
    !passwordConfirmError &&
    !nicknameError &&
    !phoneError &&
    isNicknameVerified &&
    email &&
    password &&
    passwordConfirm &&
    nickname &&
    phone &&
    agreeAge &&
    agreeServiceTerms;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[3.5rem] w-full">
      <div className="flex flex-col gap-[2.5rem]">
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

        <div className="flex flex-col gap-[0.6875rem]">
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
        </div>

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
      </div>

      <AgreementSection
        agreeAll={agreeAll}
        agreeAge={agreeAge}
        agreeServiceTerms={agreeServiceTerms}
        agreePrivacy={agreePrivacy}
        onAgreeAll={handleAgreeAll}
        onAgreeAge={handleAgreeAge}
        onAgreeServiceTerms={handleAgreeServiceTerms}
        onAgreePrivacy={handleAgreePrivacy}
      />

      <Button
        type="submit"
        variant={isFormValid ? 'primary' : 'disabled'}
        disabled={!isFormValid}
        className="w-full h-[4.625rem] !p-0 flex items-center justify-center gap-[0.625rem]"
      >
        가입 완료
      </Button>
    </form>
  );
}
