interface ReformerSearchResultSkeletonProps {
  count?: number;
}

const ReformerSearchResultSkeleton = ({
  count = 8,
}: ReformerSearchResultSkeletonProps) => {
  return (
    <div className="pt-12 space-y-2 flex flex-col items-center justify-center">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`w-[719px] flex flex-col gap-4 py-5 ${
            index === count - 1 ? '' : 'border-b border-[var(--color-gray-40)]'
          }`}
        >
      
          <div className="flex gap-[1.75rem] items-start">
            <div className="flex-1 space-y-2">
              <div className="h-7 bg-[var(--color-gray-30)]  w-1/2 animate-pulse" />
              <div className="h-6 bg-[var(--color-gray-30)]  w-1/3 animate-pulse" />
            </div>

            <div className="w-[100px] h-[100px] rounded-[10px] bg-[var(--color-gray-30)] flex-shrink-0 animate-pulse" />
          </div>

        <div className="gap-[0.5rem] flex flex-col">
             <div className="w-4/5 h-6 bg-[var(--color-gray-30)] animate-pulse" />
            <div className="w-4/5 h-6 bg-[var(--color-gray-30)] animate-pulse" />

          </div>
       
        </div>
      ))}
    </div>
  );
};

export default ReformerSearchResultSkeleton;
