import searchIcon from '../../../assets/icons/search2.svg';

const SearchResultEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-26 px-4 text-center">
      <div className="mb-8">
        <img
          src={searchIcon}
          alt="검색"
          className="w-[89px] h-[89px]"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
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

export default SearchResultEmpty;
