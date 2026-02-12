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

  // 디버깅: 쿼리 파라미터 확인
  useEffect(() => {
    console.log('KakaoSignup 쿼리 파라미터:', {
      kakaoId,
      email,
      role,
      redirectUrl,
      allParams: Object.fromEntries(searchParams.entries()),
    });
  }, [kakaoId, email, role, redirectUrl, searchParams]);

  const { signup } = useSignup();
  // 리폼러 회원가입은 별도 페이지에서 처리되므로 여기서는 사용하지 않음
  // const { signup: reformerSignup } = useReformerSignup();

  const [isReformer, setIsReformer] = useState(role === 'reformer');

  useEffect(() => {
    // role에 따라 isReformer 상태 설정
    setIsReformer(role === 'reformer');
  }, [role]);

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

  if (!kakaoId || !email || !role) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="body-b1-md text-[var(--color-black)]">잘못된 접근입니다.</p>
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
        <p className="body-b1-rg text-center text-[var(--color-gray-60)] mb-[2.8125rem]">
          카카오 계정으로 로그인하셨습니다. 추가 정보를 입력해주세요.
        </p>
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
