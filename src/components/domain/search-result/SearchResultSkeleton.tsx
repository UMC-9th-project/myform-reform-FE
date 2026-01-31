interface SearchResultSkeletonProps {
  count?: number;
  columns?: number;
}

const SearchResultSkeleton = ({
  count = 15,
  columns = 3,
}: SearchResultSkeletonProps) => {
  return (
    <div
      className="px-40 grid gap-x-10 gap-y-14 w-full mt-10"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col">
          {/* 이미지 영역 - 큰 사각형 */}
          <div
            className="w-full bg-[var(--color-gray-20)] rounded-[0.825rem] "
            style={{ aspectRatio: '361/307' }}
          />
          {/* 텍스트 영역 */}
          <div className="pt-5 pb-6 flex flex-col gap-2">
            <div className="h-6 bg-[var(--color-gray-20)] w-full" />
            <div className="h-6 bg-[var(--color-gray-20)] w-full" />
            <div className="h-10 bg-[var(--color-gray-20)] w-1/2 mb-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultSkeleton;
