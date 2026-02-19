import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/button/Button1';
import approvalPending from '../../assets/login/loginpending.jpg';
import RightIcon from '../../assets/icons/right.svg?react';

const ReformerApprovalPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center ">
      <div className="w-full max-w-lg flex flex-col items-center text-center">
        <div className="mb-[67px] flex justify-center">
          <img src={approvalPending} alt="approval-pending" />
        </div>

        <h1 className="heading-h2-bd mb-[9px]">리폼러 승인 대기 중입니다!</h1>

        <div className="heading-h5-sb mb-[67px] text-(--color-gray-50)">
          <p>
            프로필 검토가 24시간 내 완료될 예정이에요. <br />
            승인 후 리폼러로 로그인이 가능하며, <br />
            검토 완료 알림은 문자로 보내드려요.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="big"
          onClick={() => navigate('/home')}
          className="w-[543px] h-[74px] rounded-[10px] flex items-center justify-center gap-2"
        >
          <span>홈으로 돌아가기</span>
          <RightIcon className="w-10 h-10" />
        </Button>
      </div>
    </div>
  );
};

export default ReformerApprovalPending;
