import Rectangle from '../market/images/Rectangle.png';
import profile from '../market/images/profile.png';

export default function ReformerCard() {
  const reformer = {
    title: '경력 7년 / 평균 응답시간 10분',
    profile: profile,
    img: Rectangle,
    name: '리폼천국',
    keywords: ['#키워드', '#리폼의 달인'],
    description: '당신의 멋진 상상을 리폼천국에서 실현하세요!',
    count: '200건+',
    review: '145개',
  };
  return (
    <div className="flex w-[384px] h-[231px] justify-between pl-[1.5625rem]   gap-[1.5625rem] rounded-[1.875rem] shadow-[0_0_20.5px_0_rgba(0,0,0,0.15)]">
      <div className="flex flex-col w-[174px]">
        <div className="body-b5-sb pt-[0.625rem] text-[var(--color-gray-50)] mb-[1.3125rem]">
          <p>{reformer.title}</p>
        </div>
        <div className="mb-[0.125rem]">
          <img src={reformer.profile} alt={reformer.name} />
        </div>
        <div className="body-b1-sb">
          <p>{reformer.name}</p>
        </div>

        <div className=" etc-c1-rg flex gap-[0.3125rem] ">
          {reformer.keywords.map((keyword) => (
            <div className="border border-[var(--color-mint-1)] rounded-[0.625rem] px-[0.375rem] py-[0.125rem] mb-[0.375rem]">
              {keyword}
            </div>
          ))}
        </div>
        <div className="body-b5-sb text-[var(--color-gray-50)] mb-[0.3125rem]">
          <p>{reformer.description}</p>
        </div>
        <div className="flex flex-col">
          <div className="body-b5-rg text-[var(--color-gray-50)] flex gap-[0.3125rem]">
            총 거래 건수
            <span className="body-b5-sb text-[var(--color-black)]">
              {reformer.count}
            </span>
          </div>

          <div className="body-b5-rg text-[var(--color-gray-50)] flex gap-[0.375rem]">
            리뷰
            <span className="body-b5-sb text-[var(--color-black)]">
              {reformer.review}
            </span>
          </div>
        </div>
      </div>
      <div>
        <img src={reformer.img} alt={reformer.name} />
      </div>
    </div>
  );
}
