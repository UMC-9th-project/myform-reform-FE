import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSignup } from '../../hooks/domain/signup/useSignup';
import SignupForm from '../../components/domain/signup/form/SignupForm';
import type { SignupRequest } from '../../types/api/auth';

const KakaoSignup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 백엔드에서 kakaold 또는 kakaoId로 보낼 수 있으므로 둘 다 체크
  const kakaoId = searchParams.get('kakaoId') || searchParams.get('kakaold');
  const email = searchParams.get('email');
  const role = searchParams.get('role') as 'user' | 'reformer' | null;
  const redirectUrl = searchParams.get('redirectUrl') || '/';
  const accessToken = searchParams.get('accessToken');

  const { signup } = useSignup();
  // 리폼러 회원가입은 별도 페이지에서 처리되므로 여기서는 사용하지 않음
  // const { signup: reformerSignup } = useReformerSignup();

  const [isReformer, setIsReformer] = useState(role === 'reformer');

  useEffect(() => {
    setIsReformer(role === 'reformer');
  }, [role]);

  // 이미 가입된 사용자: 회원가입용 파라미터는 없고 accessToken만 있는 경우 → 로그인 전용 콜백으로 이동
  useEffect(() => {
    const hasSignupParams = kakaoId && email && role;
    if (!hasSignupParams && accessToken) {
      const params = new URLSearchParams();
      params.set('accessToken', accessToken);
      if (redirectUrl && redirectUrl !== '/')
        params.set('redirectUrl', redirectUrl);
      navigate(`/login/callback?${params.toString()}`, { replace: true });
    }
  }, [kakaoId, email, role, accessToken, redirectUrl, navigate]);

  const handleSignup = (signupData: SignupRequest) => {
    // 카카오 회원가입 정보 추가
    const kakaoSignupData: SignupRequest = {
      ...signupData,
      registration_type: 'KAKAO',
      oauthId: kakaoId || '',
      password: '', // 카카오 로그인 시 password는 필요 없음
    };

    if (isReformer) {
      // 리폼러 회원가입은 별도 페이지로 이동
      navigate('/signup/reformer-registration', {
        state: {
          signupData: kakaoSignupData,
          redirectUrl,
        },
      });
    } else {
      // 일반 유저 회원가입
      signup(kakaoSignupData);
    }
  };

  const hasSignupParams = kakaoId && email && role;
  if (!hasSignupParams) {
    if (accessToken) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="body-b1-md text-[var(--color-black)]">
              로그인 처리 중...
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="body-b1-md text-[var(--color-black)]">
            잘못된 접근입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-[3.1875rem] pb-[7.5rem]">
      <div className="w-[543px]">
        <h1 className="heading-h4-bd text-center mb-[2.8125rem]">
          {isReformer ? '리폼러 회원가입' : '회원가입'}
        </h1>

        <SignupForm
          initialEmail={email}
          isKakao={true}
          onSubmit={handleSignup}
        />
      </div>
    </div>
  );
};

export default KakaoSignup;
