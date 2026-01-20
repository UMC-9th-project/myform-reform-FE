import profile from '../market/images/profile.png';
import starIcon from '../../../assets/icons/star.svg';

interface ReformerSearchCardProps {
  name: string;
  rating: number;
  reviewCount: number;
  transactionCount: number;
  description: string;
  tags: string[];
  onClick?: () => void;
}

const ReformerSearchCard = ({
  name,
  rating,
  reviewCount,
  transactionCount,
  description,
  tags,
  onClick,
}: ReformerSearchCardProps) => {
  return (
    <div
      className=" bg-white rounded-[1.25rem] p-[1.5rem] flex flex-col gap-[0.875rem] cursor-pointer w-full"
      style={{
        boxShadow: '0px 3px 11px 0px rgba(0, 0, 0, 0.22)',
        height: '250px',
      }}
      onClick={onClick}
    >
      {/* 프로필 이미지와 이름 */}
      <div className="flex items-center gap-[0.75rem]">
        <img
          src={profile}
          alt={name}
          className="w-[5.75rem] h-[5.75rem] rounded-full object-cover border border-[rgba(0,0,0,0.15)]"
        />
        <div className="flex flex-col gap-[0.25rem]">
          <h3 className="body-b0-sb text-[var(--color-black)]">{name}</h3>
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
              <span className="text-[var(--color-black)]">{transactionCount}</span>
              <span className="text-[var(--color-gray-50)]">회 거래</span>
            </span>
          </div>
        </div>
      </div>

      {/* 설명 */}
      <p className="body-b2-rg text-[var(--color-gray-50)] line-clamp-2">
        {description}
      </p>

      {/* 해시태그 */}
      <div className="flex gap-[0.5rem] flex-wrap">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="body-b3-rg text-[var(--color-mint-1)]  border border-[var(--color-mint-1)] px-[0.625rem] py-[0.25rem] rounded-[1rem]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReformerSearchCard;
