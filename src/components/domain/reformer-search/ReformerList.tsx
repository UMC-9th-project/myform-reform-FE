import ReformerSearchCard from './ReformerProfileCard';
import rightIcon from '../../../assets/icons/right.svg';

export interface ReformerListItem {
  id: number | string;
  name: string;
  rating: number;
  reviewCount: number;
  transactionCount: number;
  description: string;
  tags: string[];
}

interface ReformerListProps {
  title?: string;
  showEmoji?: boolean;
  onMoreClick?: () => void;
  items: ReformerListItem[];
  className?: string;
}

const ReformerList = ({
  title = '전체 리폼러 한눈에 보기 👀',
  onMoreClick,
  items,
  className = '',
}: ReformerListProps) => {
  return (
    <section className={`pb-[6.25rem] px-[110px] ${className}`}>
      <div className="flex items-center justify-between pb-[1.875rem] ">
        <div className="flex items-center gap-[0.5rem]">
         {/* 전체 리폼러 한눈에보기 */}
          <h2 className="heading-h4-bd text-[var(--color-black)]">{title}</h2>
  
        </div>
        {/* 더보기 버튼 */}
        <button
          type="button"
          onClick={onMoreClick}
          className=" body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors flex items-center gap-[0.5rem]"
        >
          <span>더보기</span>
          <img src={rightIcon} alt="right" className="w-[2rem] h-[2rem] mb-[0.25rem]" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-[1.875rem]">
        {items.map((reformer) => (
          <ReformerSearchCard
            key={reformer.id}
            name={reformer.name}
            rating={reformer.rating}
            reviewCount={reformer.reviewCount}
            transactionCount={reformer.transactionCount}
            description={reformer.description}
            tags={reformer.tags}
          />
        ))}
      </div>
    </section>
  );
};

export default ReformerList;
