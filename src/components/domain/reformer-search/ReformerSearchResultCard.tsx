import profile from '../market/images/profile.png';
import starIcon from '../../../assets/icons/star.svg';

interface ReformerSearchResultCardProps {
  name: string;
  rating: number;
  reviewCount: number;
  transactionCount: number;
  description: string;
  tags: string[];
  onClick?: () => void;
}

const ReformerSearchResultCard = ({
  name,
  rating,
  reviewCount,
  transactionCount,
  description,
  tags,
  onClick,
}: ReformerSearchResultCardProps) => {
  return (
    <div
      className="bg-white pt-4 pb-3 flex gap-[1.5rem] cursor-pointer w-[719px] border-b border-[var(--color-gray-40)]"
     
      onClick={onClick}
    >
      {/* 왼쪽: 텍스트 정보 */}
      <div className="flex-1 flex flex-col gap-[0.575rem]">
        {/* 이름 */}
        <h3 className="body-b0-sb text-[var(--color-black)]">{name}</h3>

        {/* 별점과 거래 횟수 */}
        <div className="flex items-center gap-[0.375rem]">
          <img
            src={starIcon}
            alt="star"
            className="w-[1.25rem] h-[1.25rem]"
          />
          <span className="body-b3-rg">
            <span className="text-[var(--color-black)]">{rating}</span>{' '}
            <span className="text-[var(--color-gray-50)]">
              ({reviewCount})
            </span>
          </span>
          <span className="body-b3-rg text-[var(--color-gray-50)]">·</span>
          <span className="body-b3-rg">
            <span className="text-[var(--color-black)]">{transactionCount}회 </span>
            <span className="text-[var(--color-gray-50)]">거래</span>
          </span>
        </div>

        {/* 해시태그 */}
        <div className="flex gap-[0.5rem] flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="body-b3-rg text-[var(--color-mint-1)] border border-[var(--color-mint-1)] px-[0.625rem] py-[0.25rem] rounded-[1rem]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 설명 */}
        <p className="pt-4 body-b2-rg text-[var(--color-gray-50)] line-clamp-3">
          {description}
        </p>
      </div>

      {/* 오른쪽: 프로필 이미지 */}
      <div className="flex-shrink-0">
        <img
          src={profile}
          alt={name}
          className="w-[100px] h-[100px] rounded-[10px] object-cover border border-[rgba(0,0,0,0.15)]"
        />
      </div>
    </div>
  );
};

export default ReformerSearchResultCard;
