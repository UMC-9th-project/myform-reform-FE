import { Link } from 'react-router-dom';
import LoginForm from '../../components/domain/login/Form/LoginForm';
import logo2 from '../../assets/logos/logo2.svg';
import kakaologin from '../../assets/login/kakaologin.svg';

const handleKakaoLogin = () => {
  window.open(
    'https://kauth.kakao.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code',
    '_self'
  );
};

const Login = () => {
    return (
        <div className=" w-[543px] mx-auto flex flex-col justify-center items-center h-screen">
          <div className="mb-[1.5625rem] py-[2.16688rem]">
            <img src={logo2} alt="logo" />
          </div>
    
          <div className="text-center heading-h4-bd mb-[2.8125rem]">
            <p>로그인</p>
          </div>
    
          <LoginForm />
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="mt-[2.6875rem] mb-[0.9375rem] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={kakaologin} alt="카카오 로그인" />
          </button>
    
          <div className="body-b1-rg flex py-[1.8125rem] px-[1.875rem] gap-[1.8125rem] text-[var(--color-gray-60)]">
            <p>이미 내폼리폼 회원이신가요?</p>
            <Link
              to="/signup"
              className="text-[var(--color-mint-1)] underline cursor-pointer hover:scale-95 transition-all duration-300"
            >
              회원가입
            </Link>
          </div>
        </div>
      );
    };
  
  export default Login;