import ReformerSearchEngine from '../../components/domain/reformer-search/ReformerSearchEngine';
import ReformerList from '../../components/domain/reformer-search/ReformerList';
import ReformFeed from '../../components/domain/reformer-search/ReformFeed';

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
 
  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-[3.125rem] pt-[3.125rem]">
        {/* 제목 */}
        <h1 className="heading-h2-bd text-[var(--color-black)] mb-[2.5rem] pl-[110px]">
          리폼러 찾기
        </h1>

        {/* 검색 바 */}
        <ReformerSearchEngine/>

        {/* 전체 리폼러 한눈에 보기 */}
        <ReformerList items={MOCK_REFORMERS}/>

        {/* 내 리폼 취향 탐색해보기 */}
        <ReformFeed images={MOCK_PREFERENCE_IMAGES} />
      </div>
    </div>
  );
};

export default ReformerSearch;
