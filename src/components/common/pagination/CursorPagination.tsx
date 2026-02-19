interface CursorPaginationProps {
  nextCursor: string | null;
  hasMore: boolean;
  onLoadMore: (cursor?: string) => void;
}

const CursorPagination: React.FC<CursorPaginationProps> = ({ nextCursor, hasMore, onLoadMore }) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center py-5">
      <button
        className="px-6 py-2 bg-[var(--color-gray-30)] rounded-full hover:bg-[var(--color-gray-40)]"
        onClick={() => onLoadMore(nextCursor ?? undefined)}
      >
        더보기
      </button>
    </div>
  );
};

export default CursorPagination;
