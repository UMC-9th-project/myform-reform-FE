import { useState } from 'react';
import Input from '../../../common/input/Input';
import Button from '../../../common/button/Button1';
import Checkbox from '../../../common/checkbox/Checkbox';
import { useLogin } from '../../../../hooks/domain/auth/useLogin';

export default function LoginForm() {
  const { login, isLoading, error: loginApiError } = useLogin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
 
  const validateForm = () => {
    return email && password;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    login({
      email,
      password,
      role: 'user',
    });
  };

  const isFormValid = () => {
    return  email && password;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className="flex flex-col gap-[0.5625rem]">
        <Input
          type="email"
          variant="login"
          required
          placeholder="이메일을 입력해주세요."
          value={email}
          error={loginApiError}
          showErrorText={false}
          onChange={handleEmailChange}
        />

        <Input
          type="password"
          variant="login"
          required
          placeholder="비밀번호를 입력해주세요."
          value={password}
          error={loginApiError}
          showErrorText={false}
          showPasswordToggle
          onChange={handlePasswordChange}
        />
      </div>

      <div className="flex items-center justify-between mt-[0.6875rem]">
        <Checkbox
          checked={keepLoggedIn}
          onChange={setKeepLoggedIn}
          variant="circle"
          size="small"
          label="로그인 유지"
          className="gap-[0.5rem]"
        />
        {/* <button
          type="button"
          className="body-b2-rg text-[var(--color-black)] cursor-pointer hover:underline"
        >
          아이디/비밀번호 찾기
        </button> */}
      </div>

      <Button
        type="submit"
        variant={isFormValid() ? 'primary' : 'disabled'}
        disabled={!isFormValid() || isLoading}
        className="w-full h-[4.625rem] mt-[2.4375rem] flex items-center justify-center"
      >
        로그인
      </Button>
    </form>
  );
}
