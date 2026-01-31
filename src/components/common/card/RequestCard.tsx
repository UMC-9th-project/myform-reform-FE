import { Link } from 'react-router-dom';
import LikeButton from '../likebutton/LikeButton';

export type RequestDetailVariant = 'order' | 'reformer';

interface RequestCardProps {
  imgSrc?: string;
  title?: string;
  priceRange?: string;
  className?: string;
  seller?: string;
  /** 상세 페이지로 이동 시 사용할 id (variant와 함께 사용) */
  id?: number | string;
  /** 상세 경로 구분: order → /order/requests/:id, reformer → /reformer/order/requests/:id */
  variant?: RequestDetailVariant;
  /** 클릭 시 이동할 상세 페이지 경로 (직접 지정 시 id/variant 대신 사용) */
  to?: string;
}

const REQUEST_DETAIL_PATH: Record<RequestDetailVariant, string> = {
  order: '/order/requests',
  reformer: '/reformer/order/requests',
};

export default function RequestCard({
  imgSrc = '/crt1.jpg',
  title = '제 소중한 기아 쿠로미 유니폼 짐색으로 만들어 주실 리폼 장인을 찾아요',
  priceRange = '30,000원~50,000원',
  className = '',
  seller = '침착한 대머리독수리',
  id,
  variant = 'order',
  to,
}: RequestCardProps) {
  const detailTo =
    id != null ? `${REQUEST_DETAIL_PATH[variant]}/${id}` : undefined;
  const linkTo = to ?? detailTo;

  const content = (
    <article className={`w-full ${linkTo ? 'cursor-pointer' : ''} ${className}`}>
      <div className="relative w-full h-[22.375rem] rounded-[1.25rem] overflow-hidden bg-[var(--color-gray-20)]">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        {variant === 'reformer' && (
          <div className="absolute bottom-[0.75rem] right-[0.75rem] z-10">
            <LikeButton />
          </div>
        )}
      </div>

      <div className="mt-[1.125rem]">
        <p className="body-b0-sb line-clamp-2 text-[var(--color-black)]">
          {title}
        </p>
        <p className="mt-[0.75rem] heading-h4-bd text-[var(--color-black)]">
          {priceRange}
        </p>
        {seller != null && seller !== '' && (
          <span className="mt-[0.875rem] inline-flex items-center body-b5-sb text-[var(--color-gray-50)] bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.3125rem] py-[0.125rem]">
            {seller}
          </span>
        )}
      </div>
    </article>
  );

  if (linkTo) {
    return <Link to={linkTo} className="block w-full">{content}</Link>;
  }
  return content;
}
