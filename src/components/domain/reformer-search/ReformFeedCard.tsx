import feedIcon from '../../../assets/icons/feed.svg';

interface ReformFeedCardProps {
  id: number | string;
  image: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
}

const ReformFeedCard = ({
  id,
  image,
  alt,
  onClick,
  className = '',
}: ReformFeedCardProps) => {
  return (
    <div
      key={id}
      className={`relative overflow-hidden cursor-pointer group ${className}`}
      style={{ aspectRatio: '1/1.3' }}
      onClick={onClick}
    >
      <img
        src={image}
        alt={alt || `preference ${id}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-2 right-2 md:top-[0.75rem] md:right-[0.75rem] flex items-center justify-center">
        <img src={feedIcon} alt="feed" className="w-8 h-8 md:w-[3rem] md:h-[3rem]" />
      </div>
    </div>
  );
};

export default ReformFeedCard;
