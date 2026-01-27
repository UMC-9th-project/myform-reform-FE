import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button/button1';
import signupcomplete from '../../../assets/signup/signupcomplete.jpg';
import rightIcon from '../../../assets/icons/right.svg';


const ReformerRegistrationComplete = () => {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate('/reformer-profile-edit');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pb-[7.5rem] pt-[5rem]">
      <div className="w-[39rem] flex flex-col items-center gap-[4.1875rem]">
       
        <div className="w-[22rem] h-[21.25rem] relative">
          <img
            src={signupcomplete}
            alt="회원가입 완료"
            className="w-full h-full object-contain"
          />
        </div>

      
        <div className="flex flex-col items-center gap-[0.5625rem]">
          <h1 className="heading-h2-bd text-[var(--color-black)] text-center">
            제출이 완료되었습니다!
          </h1>
          <div className="heading-h5-sb text-[var(--color-gray-50)] text-center">
            <p className="mb-0">프로필 검토가 24시간 내 완료될 예정이에요.</p>
            <p>승인 후 리폼러로 활동이 가능합니다!</p>
          </div>
        </div>

       
        <div className="flex flex-col gap-[0.625rem] w-[33.9375rem]">
          <Button
            variant="primary"
            size="big"
            onClick={handleGoToProfile}
            className="w-full h-[4.625rem] flex items-center justify-center gap-[0.625rem]"
          >
            <span>내 프로필 업로드하러 가기</span>
            <div className="w-10 h-10 flex items-center justify-center">
            <img
            src={rightIcon}
            alt=""
            className="w-10 h-10 pb-1"
            style={{
              filter: 'brightness(0) saturate(100%) invert(100%)',
            }}
          />            </div>
          </Button>
          <Button
            variant="outlined-mint"
            size="big"
            onClick={handleGoHome}
            className="w-full h-[4.625rem] flex items-center justify-center gap-[0.625rem]"
          >
            <span>홈으로 돌아가기</span>
            <div className="w-10 h-10 flex items-center justify-center">
            <img
            src={rightIcon}
            alt=""
            className="w-10 h-10 pb-1"
            style={{
              filter: 'brightness(0) saturate(100%) invert(100%)',
            }}
          />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReformerRegistrationComplete;
