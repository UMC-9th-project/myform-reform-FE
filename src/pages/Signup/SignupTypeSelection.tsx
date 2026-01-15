import UserTypeSelector from '../../components/domain/signup/UserTypeSelector/UserTypeSelector';
import { useNavigate } from 'react-router-dom';

import logo2 from '../../assets/logos/logo2.svg';
import customer from '../../components/domain/signup/UserTypeSelector/image/customer-icon.png';
import reformer from '../../components/domain/signup/UserTypeSelector/image/reformer-icon.png';

const SignupTypeSelection = () => {
  const navigate = useNavigate();
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
          onClick={() => navigate('/signup/form-customer')}
        />

        <UserTypeSelector
          icon={reformer}
          title="리폼러로 활동하기"
          description="나만의 작품을 판매하고 리폼 견적 제안을 통해 수익을 창출해요."
          alt="customer"
        />
      </div>

      <div className="body-b1-rg flex my-[1.8125rem] text-[var(--color-gray-60)]">
        <p>가입 이후에도 원하는 상태로 언제든 변경 가능해요!</p>
      </div>
    </div>
  );
};

export default SignupTypeSelection;
