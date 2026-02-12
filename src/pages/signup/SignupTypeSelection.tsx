import UserTypeSelector from '../../components/domain/signup/usertype_selector/UserTypeSelector';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { startKakaoLogin } from '../../api/auth';

import logo2 from '../../assets/logos/logo2.svg';
import customer from '../../components/domain/signup/usertype_selector/image/customer-icon.png';
import reformer from '../../components/domain/signup/usertype_selector/image/reformer-icon.png';

const SignupTypeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isLoginMode = location.pathname === '/login/type';
  const isKakaoLogin = searchParams.get('kakao') === 'true';

  const handleTypeSelect = (userType: 'user' | 'reformer') => {
    console.log('타입 선택:', userType);
    console.log('isLoginMode:', isLoginMode);
    console.log('isKakaoLogin:', isKakaoLogin);
    
    if (isLoginMode) {
      navigate(userType === 'user' ?  '/login' : '/login/reformer');
    } else if (isKakaoLogin) {
      // 카카오 로그인인 경우 선택한 타입으로 카카오 로그인 시작
      // 회원가입이 필요한 경우 /kakao/signup으로 리다이렉트
      console.log('카카오 로그인 시작:', userType);
      startKakaoLogin(userType, '/kakao/signup');
    } else {
      // 일반 이메일 회원가입인 경우
      navigate(`/signup/${userType}-form`);
    }
  };

  return (
    <div className=" w-[543px] mx-auto flex flex-col justify-center items-center h-screen">
      <div className="mb-[1.5625rem] py-[2.16688rem]">
        <img src={logo2} alt="logo" />
      </div>

      <div className="text-center heading-h4-bd mb-[2.8125rem]">
        <p>내폼리폼에서 서비스를</p>
        <p>어떻게 이용하고 싶으세요?</p>
      </div>

      <div className="flex gap-[1.875rem]">
        <UserTypeSelector
          icon={customer}
          title="일반 모드로 활용하기"
          description="필요한 상품을 구매하고 리폼 요청 및 맞춤 견적을 받아요."
          alt="customer"
          onClick={() => handleTypeSelect('user')}
        />

        <UserTypeSelector
          icon={reformer}
          title="리폼러로 활동하기"
          description="나만의 작품을 판매하고 리폼 견적 제안을 통해 수익을 창출해요."
          alt="reformer"
          onClick={() => handleTypeSelect('reformer')}
        />
      </div>

      
    </div>
  );
};

export default SignupTypeSelection;
