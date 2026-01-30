import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/button_tmp/button1';
import rightIcon from '../../assets/icons/right.svg';

import signupcomplete from '../Signup/images/signupcomplete.png';

const SignupComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const nickname = (location.state as { nickname?: string })?.nickname || '침착한 대머리독수리';

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pb-[7.5rem] pt-[5rem] px-[28rem]">
      <div className="w-[624px] flex flex-col items-center gap-[3.5rem]">

        <div>
           <img src={signupcomplete}/>
        </div>

        
        <div className="flex flex-col gap-[3.5rem] items-center w-full">
      
          <div className="heading-h2-bd text-center">
            <p>
              <span className="text-[var(--color-mint-1)]">{nickname}</span>
              <span className="text-[var(--color-black)]">님</span>
            </p>
            <p className="text-[var(--color-black)]">
              회원가입이 <span className="font-bold">완료되었습니다!</span>
            </p>
          </div>

          <div className="flex justify-center w-full">
            <Button
              variant="primary"
              size="big"
              onClick={handleGoHome}
              className="w-[543px] h-[4.625rem] !p-0 flex items-center justify-center gap-[0.625rem]"
            >
              <span className="flex items-center justify-center gap-[0.625rem]">홈으로 돌아가기
              <img
                src={rightIcon}
                alt="right arrow"
                className="w-10 h-10 pb-1"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(100%)',
                }}
              />
              </span>
             
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComplete;
