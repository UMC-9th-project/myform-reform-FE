import WishlistSidebar from '../../components/domain/wishlist/WishlistSidebar';
import WishlistItemCard from '../../components/domain/wishlist/WishlistItemCard';
import RequestCard from '../../components/common/card/RequestCard';
import EmptyWishlist from '../../components/domain/wishlist/EmptyWishlist';
import { useWishlistPage } from '../../hooks/domain/wishlist/useWishlistPage';

const Wishlist = () => {
  const {
    activeMenu,
    wishData,
    isLoading,
    isReformer,
    currentItems,
    requestDetailsMap,
    handleMenuChange,
    handleRemoveFromWishlist,
  } = useWishlistPage();

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-[3.125rem] pt-[1.875rem]"></div>

      <div className="px-[3.125rem]">
        <div className="flex gap-[1.875rem]">
          <WishlistSidebar
            activeMenu={activeMenu}
            onMenuChange={handleMenuChange}
          />

          <div className="flex-1">
            {isLoading ? (
              <div className="mt-[3.125rem]">로딩 중...</div>
            ) : !wishData?.success?.list || wishData.success.list.length === 0 ? (
              <EmptyWishlist />
            ) : isReformer && activeMenu === 'custom' ? (
              <div className="grid grid-cols-3 gap-[1.875rem] mt-[3.125rem]">
                {wishData.success.list.map((item, index) => {
                  const detail = requestDetailsMap.get(item.itemId);
                  const priceRange = detail
                    ? `${detail.minBudget.toLocaleString('ko-KR')}원~${detail.maxBudget.toLocaleString('ko-KR')}원`
                    : `${item.price.toLocaleString('ko-KR')}원`;
                  
                  return (
                    <RequestCard
                      key={`${item.itemId}-${index}`}
                      id={item.itemId}
                      imgSrc={item.content || ''}
                      title={item.title}
                      priceRange={priceRange}
                      variant="reformer"
                      isWished={true}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[1.875rem] mt-[3.125rem]">
                {currentItems.map((item, index) => (
                  <WishlistItemCard
                    key={`${item.itemId}-${index}`}
                    item={item}
                    onRemove={() => handleRemoveFromWishlist(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
