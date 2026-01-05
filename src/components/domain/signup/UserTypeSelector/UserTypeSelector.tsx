export const TYPOGRAPHY_CLASSES = {
  title: 'heading-h5-sb text-[var(--color-black)] text-left',
  description: 'body-b3-rg text-[var(--color-gray-50)] text-left',
} as const;

export const CARDCLASSES =
  'w-[297px] h-[321px] p-[2.25rem_2.3125rem] flex flex-col gap-[0.625rem] rounded-[1.25rem] bg-[var(--color-gray-20)] border border-[var(--color-gray-20)] hover:bg-[var(--color-white)] hover:border-[var(--color-black)] hover:shadow-[0_4px_15.4px_0_rgba(0,0,0,0.09)] transition-all duration-200 cursor-pointer' as const;

interface UserTypeCardProps {
  icon: string;
  title: string;
  description: string;
  alt: string;
  onClick?: () => void;
}

export default function UserTypeSelector({
  icon,
  title,
  description,
  alt,
  onClick,
}: UserTypeCardProps) {
  return (
    <button type="button" className={CARDCLASSES} onClick={onClick}>
      <div className="w-[173px] h-[138px]">
        <img src={icon} alt={alt} />
      </div>
      <div className="w-[223px] flex flex-col gap-[0.5625rem] mt-[0.625rem]">
        <h3 className={TYPOGRAPHY_CLASSES.title}>{title}</h3>
        <p className={TYPOGRAPHY_CLASSES.description}>{description}</p>
      </div>
    </button>
  );
}
