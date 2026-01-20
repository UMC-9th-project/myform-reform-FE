import searchIcon from '../../../assets/icons/search2.svg';

const ReformerSearchResultEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-16">
      {/* 큰 돋보기 아이콘 */}
      <div className="mb-[2rem]">
        <img
          src={searchIcon}
          alt="search"
          className="w-[89px] h-[89px]"
       
        />
      </div>

      {/* 메시지 */}
      <div className="flex flex-col items-center gap-[0.5rem]">
        <p className="body-b1-md text-[var(--color-black)]">
          검색 결과를 찾을 수 없습니다.
        </p>
        <p className="body-b2-rg text-[var(--color-gray-50)]">
          다른 검색어를 입력해주세요.
        </p>
      </div>
    </div>
  );
};

export default ReformerSearchResultEmpty;
