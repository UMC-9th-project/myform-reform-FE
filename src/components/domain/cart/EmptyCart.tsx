import { useNavigate } from 'react-router-dom';
import Button from '../../common/button/button1';
import rightIcon from '../../../assets/icons/right.svg';

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[37.5rem] flex items-center justify-center">
      <div className="flex flex-col items-center gap-[1.875rem]">
        <div className="flex flex-col items-center gap-[0.75rem]">
          <p className="body-b0-sb text-[var(--color-gray-60)]">
            장바구니에 담긴 상품이 없습니다.
          </p>
          <p className="body-b1-rg text-[var(--color-gray-50)]">
            원하는 상품을 담아보세요!
          </p>
        </div>
        <Button
          variant="primary"
          className="!px-[2.5rem] !py-[1.125rem] body-b0-bd flex items-center gap-[0.5rem]"
          onClick={() => navigate('/*추후 라우팅 추가*/')}
        >
          마켓 둘러보기
          <img
            src={rightIcon}
            alt=""
            className="w-10 h-10 pb-1"
            style={{
              filter: 'brightness(0) saturate(100%) invert(100%)',
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default EmptyCart;
