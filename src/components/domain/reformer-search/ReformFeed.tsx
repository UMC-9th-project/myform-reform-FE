import ReformFeedCard from './ReformFeedCard';
import rightIcon from '../../../assets/icons/right.svg';

export interface PreferenceImage {
  id: number | string;
  image: string;
}

interface ReformFeedProps {
  title?: string;
  onMoreClick?: () => void;
  images: PreferenceImage[];
  className?: string;
  onCardClick?: (id: number | string) => void;
}

const ReformFeed = ({
  title = '내 리폼 취향 탐색해보기 🔍',
  onMoreClick,
  images,
  className = '',
  onCardClick,
}: ReformFeedProps) => {
  return (
    <section className={`mb-[4.375rem] px-[110px] ${className}`}>
      <div className="flex items-center justify-between mb-[1.875rem]">
        <div className="flex items-center gap-[0.5rem]">
          <h2 className="heading-h4-bd text-[var(--color-black)]">{title}</h2>
      
        </div>
        <button
          type="button"
          onClick={onMoreClick}
          className="body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors flex items-center gap-[0.5rem]"
        >
          <span>더보기</span>
          <img src={rightIcon} alt="right" className="w-[2rem] h-[2rem] mb-[0.25rem]" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-[0.875rem]">
        {images.map((item) => (
          <ReformFeedCard
            key={item.id}
            id={item.id}
            image={item.image}
            onClick={() => onCardClick?.(item.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default ReformFeed;
