import { useNavigate } from 'react-router-dom';
import Button1 from '../../components/common/button_tmp/button1';

import logo2 from '../../assets/logos/logo2.svg';
import kakao from '../../assets/signup/kakao.svg';

const KakaoLogin = () => {
  const kakaoLoginWindow = window.open(
    'https://kauth.kakao.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code'
  );
  return kakaoLoginWindow;
};

const SignupIndex = () => {
  const navigate = useNavigate();

  return (
    <div className=" w-[543px] mx-auto flex flex-col justify-center items-center h-screen">
      <div className="mb-[1.5625rem] py-[2.16688rem]">
        <img src={logo2} alt="logo" />
      </div>

      <div className="text-center heading-h4-bd mb-[2.8125rem]">
        <p>스포츠 유니폼 리폼 플랫폼,</p>
        <p>내폼리폼과 함께 쉽게 리폼을 시작해요!</p>
      </div>

      <Button1
        variant="kakao"
        size="default"
        onClick={KakaoLogin}
        className="body-b0-md w-full mb-[1.25rem] rounded-[0.9375rem]"
      >
        <img src={kakao} alt="kakao" />
        카카오 계정으로 로그인하기
      </Button1>

      <Button1
        variant="white"
        size="default"
        className="body-b0-md w-full mb-[2.5625rem] rounded-[0.9375rem]"
        onClick={() => {
          navigate('/signup/type');
        }}
      >
        이메일로 시작하기
      </Button1>

      <div className="body-b1-rg flex py-[1.8125rem] px-[1.875rem] gap-[1.8125rem] text-[var(--color-gray-60)]">
        <p>이미 내폼리폼 회원이신가요?</p>
        <p className="text-[var(--color-mint-1)] underline cursor-pointer hover:scale-95 transition-all duration-300">
          로그인
        </p>
      </div>
    </div>
  );
};

export default SignupIndex;
