import profile from '../market/images/profile.png';
import starIcon from '../../../assets/icons/star.svg';

interface ReformerSearchCardProps {
  name: string;
  rating: number;
  reviewCount: number;
  transactionCount: number;
  description: string;
  tags: string[];
}

const ReformerSearchCard = ({
  name,
  rating,
  reviewCount,
  transactionCount,
  description,
  tags,
}: ReformerSearchCardProps) => {
  return (
    <div className="bg-white rounded-[0.625rem] p-[1.25rem] flex flex-col gap-[0.875rem]">
      {/* 프로필 이미지와 이름 */}
      <div className="flex items-center gap-[0.75rem]">
        <img
          src={profile}
          alt={name}
          className="w-[3.75rem] h-[3.75rem] rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="body-b0-sb text-[var(--color-black)]">{name}</h3>
          <div className="flex items-center gap-[0.375rem]">
            <img
              src={starIcon}
              alt="star"
              className="w-[0.8125rem] h-[0.75rem]"
            />
            <span className="body-b3-rg">
              <span className="text-[var(--color-black)]">{rating}</span>{' '}
              <span className="text-[var(--color-gray-50)]">
                ({reviewCount})
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 거래 횟수 */}
      <p className="body-b3-rg text-[var(--color-gray-50)]">
        {transactionCount}회 거래
      </p>

      {/* 설명 */}
      <p className="body-b3-rg text-[var(--color-black)] line-clamp-2">
        {description}
      </p>

      {/* 해시태그 */}
      <div className="flex gap-[0.5rem] flex-wrap">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="body-b5-sb text-[var(--color-mint-1)] bg-[var(--color-mint-6)] px-[0.625rem] py-[0.25rem] rounded-[0.375rem]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReformerSearchCard;
