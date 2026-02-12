import ReformerSearchCard from './ReformerProfileCard';
import rightIcon from '../../../assets/icons/right.svg';
import type { ReformerListProps } from './types';

const ReformerList = ({
  onMoreClick,
  items,
}: ReformerListProps) => {
  return (
    <section className="pt-8 md:pt-[4.375rem] pb-12 md:pb-[6.25rem] px-4 md:px-[110px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 md:pb-[1.875rem] gap-4">
        <div className="flex items-center gap-[0.5rem]">
         {/* 전체 리폼러 한눈에보기 */}
          <h2 className="heading-h4-bd text-[var(--color-black)]">전체 리폼러 한눈에 보기 👀</h2>
  
        </div>
        {/* 더보기 버튼 */}
        <button
          type="button"
          onClick={onMoreClick}
          className="body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors flex items-center gap-[0.5rem] cursor-pointer"
        >
          <span>더보기</span>
          <img src={rightIcon} alt="right" className="w-[2rem] h-[2rem] mb-[0.25rem]" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
        {items.map((reformer) => (
          <ReformerSearchCard
            key={reformer.owner_id}
            reformer={reformer}
          />
        ))}
      </div>
    </section>
  );
};

export default ReformerList;
