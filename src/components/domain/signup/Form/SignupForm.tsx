import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../common/input_tmp/Input';
import Button from '../../../common/button/button1';
import AgreementSection from '../AgreementSection';
import {
  emailSchema,
  passwordSchema,
  nicknameSchema,
  phoneSchema,
} from '../../../../schemas/signup';
import { validateField } from '../../../../utils/domain/formValidation';
import { usePhoneVerification } from '../../../../hooks/domain/signup/usePhoneVerification';
import { useNicknameDuplicate } from '../../../../hooks/domain/signup/useNicknameDuplicate';

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

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeServiceTerms, setAgreeServiceTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Custom Hooks
  const {
    phoneTimerActive,
    phoneTimeLeft,
    startTimer: startPhoneTimer,
  } = usePhoneVerification(180);

  const {
    isNicknameVerified,
    nicknameDuplicateError,
    verifyNickname,
    resetVerification: resetNicknameVerification,
    setDuplicateError: setNicknameDuplicateError,
  } = useNicknameDuplicate();

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
    resetNicknameVerification();
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    validateField(value, phoneSchema, setPhoneError, false);
  };

  const handlePhoneVerificationRequest = () => {
    if (!phoneError && phone) {
      startPhoneTimer();
    }
  };

  const handleNicknameDuplicateCheck = () => {
    if (!nicknameError && nickname.trim()) {
      verifyNickname();
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
          variant="signup"
          label="이메일"
          required
          placeholder="이메일을 입력해주세요."
          value={email}
          error={emailError}
          onChange={handleEmailChange}
        />

        <div className="flex flex-col gap-[0.6875rem]">
          <Input
            type="password"
            variant="signup"
            label="비밀번호"
            required
            placeholder="영문, 숫자, 특수문자가 들어간 8자 이상으로 조합해주세요."
            value={password}
            error={passwordError}
            showPasswordToggle
            onChange={handlePasswordChange}
          />

          <Input
            type="password"
            variant="signup"
            placeholder="비밀번호를 한번 더 입력해주세요."
            value={passwordConfirm}
            error={passwordConfirmError}
            showPasswordToggle
            onChange={handlePasswordConfirmChange}
          />
        </div>

        <Input
          type="text"
          variant="signup"
          label="닉네임"
          required
          placeholder="닉네임을 입력해주세요. (10자 이내)"
          value={nickname}
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
          variant="signup"
          label="전화번호"
          required
          placeholder="-를 제외한 숫자만 입력해주세요."
          value={phone}
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
        className="w-full h-[4.625rem] flex items-center justify-center"
      >
        가입 완료
      </Button>
    </form>
  );
}
