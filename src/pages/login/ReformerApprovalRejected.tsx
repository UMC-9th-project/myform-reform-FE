import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/button/Button1';
import RightIcon from '../../assets/icons/right.svg?react';
import approvalRejected from '../../assets/login/loginrejected.jpg';

const ReformerApprovalRejected = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full  flex flex-col items-center text-center ">
        <div className="mb-[67px] flex justify-center">
          <img src={approvalRejected} alt="approval-rejected" />
        </div>

        <h1 className="heading-h2-bd mb-[9px]">리폼러로 활동할 수 없어요.</h1>

        <div className="heading-h5-sb mb-[67px] text-(--color-gray-50)">
          <p>
            프로필 검토 결과, 아쉽게도 리폼러 승인이 반려되었어요.
            <br />
            포트폴리오를 보완해 다시 신청해보세요.
            <br />
            10일이 지난 후 프로필 재제출이 가능합니다!
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="big"
          onClick={() => navigate('/home')}
          className="w-full max-w-[543px] h-[74px] rounded-[10px] flex items-center justify-center gap-2"
        >
          <span>홈으로 돌아가기</span>
          <RightIcon className="w-10 h-10" />
        </Button>
      </div>
    </div>
  );
};

export default ReformerApprovalRejected;
