import customereIcon from './icons/customer-icon.png';
import reformerIcon from './icons/reformer-icon.png';

const TYPOGRAPHY_CLASSES = {
  title: 'heading-h5-sb text-[var(--color-black)] text-left',
  description: 'body-b3-rg text-[var(--color-gray-50)] text-left',
} as const;

const CARDCLASSES =
  'w-[297px] h-[321px] p-[2.25rem_2.3125rem] flex flex-col gap-[0.625rem] rounded-[1.25rem] bg-[var(--color-gray-20)] border border-[var(--color-gray-20)] hover:bg-[var(--color-white)] hover:border-[var(--color-black)] hover:shadow-[0_4px_15.4px_0_rgba(0,0,0,0.09)] transition-all duration-200 cursor-pointer' as const;

export default function UserTypeSelector() {
  const typographyClass_title = TYPOGRAPHY_CLASSES.title;
  const typographyClass_description = TYPOGRAPHY_CLASSES.description;

  return (
    <div className="w-[624px] items-center justify-center flex gap-[1.875rem]">
      <button type="button" className={CARDCLASSES}>
        <div className="w-[173px] h-[138px]">
          <img src={customereIcon} alt="일반 모드" />
        </div>
        <div className=" w-[223px] flex flex-col gap-[0.5625rem] mt-[0.625rem]">
          <h3 className={typographyClass_title}>일반 모드로 활동하기</h3>
          <p className={typographyClass_description}>
            필요한 상품을 구매하고 리폼 요청 및 맞춤 견적을 받아요.
          </p>
        </div>
      </button>

      <button
        type="button"
        className={`${CARDCLASSES} items-center justify-center`}
      >
        <div className="w-[173px] h-[138px] items-center justify-center flex">
          <img src={reformerIcon} alt="리폼러 모드" />
        </div>
        <div className=" w-[223px] flex flex-col gap-[0.5625rem] mt-[0.625rem]">
          <h3 className={typographyClass_title}>리폼러로 활동하기</h3>
          <p className={typographyClass_description}>
            나만의 작품을 판매하고 리폼 견적 제안을 통해 수익을 창출해요.
          </p>
        </div>
      </button>
    </div>
  );
}
