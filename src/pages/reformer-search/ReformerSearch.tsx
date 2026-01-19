import ReformerSearchCard from '../../components/domain/reformer-search/ReformerSearchCard';
import ReformerSearchEngine from '../../components/domain/reformer-search/ReformerSearchEngine';
import searchIcon from '../../components/layout/Header/icons/search.svg';

// 더미 데이터
const MOCK_REFORMERS = [
  {
    id: 1,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 2,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
    tags: ['#빠른', '#친절한'],
  },
  {
    id: 3,
    name: '침착한 대머리독수리',
    rating: 4.9,
    reviewCount: 271,
    transactionCount: 415,
    description:
      '- 2019년부터 리폼 공방 운영 시작 +/- 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움...',
    tags: ['#빠른', '#친절한'],
  },
];

// 더미 이미지 데이터 (내 리폼 취향 탐색해보기)
const MOCK_PREFERENCE_IMAGES = [
  {
    id: 1,
    image: '/wsh1.jpg',
  },
  {
    id: 2,
    image: '/wsh2.jpg',
  },
  {
    id: 3,
    image: '/wsh3.jpg',
  },
  {
    id: 4,
    image: '/wsh4.jpg',
  },
];

const ReformerSearch = () => {
  const handleSearch = (query: string) => {
    // TODO: API 연동 시 검색 로직 구현
    console.log('검색어:', query);
  };

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-[3.125rem] pt-[3.125rem]">
        {/* 제목 */}
        <h1 className="heading-h2-bd text-[var(--color-black)] mb-[2.5rem] pl-[90px]">
          리폼러 찾기
        </h1>

        {/* 검색 바 */}
        <ReformerSearchEngine
          placeholder="원하는 리폼러를 검색해보세요."
          onSearch={handleSearch}
          className="mb-[3.75rem]"
        />

        {/* 전체 리폼러 한눈에 보기 */}
        <section className="mb-[4.375rem]">
          <div className="flex items-center justify-between mb-[1.875rem]">
            <div className="flex items-center gap-[0.5rem]">
              <h2 className="heading-h3-bd text-[var(--color-black)]">
                전체 리폼러 한눈에 보기
              </h2>
              <span className="text-[1.25rem]">👀</span>
            </div>
            <button className="body-b1-rg text-[var(--color-gray-50)] hover:text-[var(--color-black)] transition-colors">
              더보기 &gt;
            </button>
          </div>
          <div className="grid grid-cols-3 gap-[1.875rem]">
            {MOCK_REFORMERS.map((reformer) => (
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

        {/* 내 리폼 취향 탐색해보기 */}
        <section>
          <div className="flex items-center justify-between mb-[1.875rem]">
            <div className="flex items-center gap-[0.5rem]">
              <h2 className="heading-h3-bd text-[var(--color-black)]">
                내 리폼 취향 탐색해보기
              </h2>
              <img
                src={searchIcon}
                alt="search"
                className="w-[1.25rem] h-[1.25rem]"
              />
            </div>
            <button className="body-b1-rg text-[var(--color-gray-50)] hover:text-[var(--color-black)] transition-colors">
              더보기 &gt;
            </button>
          </div>
          <div className="grid grid-cols-4 gap-[1.875rem]">
            {MOCK_PREFERENCE_IMAGES.map((item) => (
              <div
                key={item.id}
                className="relative rounded-[0.625rem] overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '1/1' }}
              >
                <img
                  src={item.image}
                  alt={`preference ${item.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-[0.75rem] right-[0.75rem] w-[1.5rem] h-[1.5rem] bg-white rounded-[0.25rem] opacity-80"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReformerSearch;
