interface RequestCardProps {
  imgSrc?: string;
  title?: string;
  priceRange?: string;
  className?: string;
  seller?: string;
}

export default function RequestCard({
  imgSrc = '/crt1.jpg',
  title = '제 소중한 기아 쿠로미 유니폼 짐색으로 만들어 주실 리폼 장인을 찾아요',
  priceRange = '30,000원~50,000원',
  className = '',
  seller = '침착한 대머리독수리',
}: RequestCardProps) {
  return (
    <article className={`w-full ${className}`}>
      <div className="w-full h-[22.375rem] rounded-[1.25rem] overflow-hidden bg-[var(--color-gray-20)]">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
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
}
