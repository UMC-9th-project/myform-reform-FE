import WishlistSidebar from '../../components/domain/wishlist/WishlistSidebar';
import MarketCard from '../../components/common/card/MarketCard';
import RequestCard from '../../components/common/card/RequestCard';
import ProposalCard from '../../components/common/card/ProposalCard';
import EmptyWishlist from '../../components/domain/wishlist/EmptyWishlist';
import { useWishlistPage } from '../../hooks/domain/wishlist/useWishlistPage';

const Wishlist = () => {
  const {
    activeMenu,
    wishData,
    isLoading,
    isReformer,
    marketItems,
    requestDetailsMap,
    proposalDetailsMap,
    handleMenuChange,
  } = useWishlistPage();

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-[3.125rem] pt-[1.875rem]"></div>

      <div className="px-[3.125rem]">
        <div className="flex gap-[1.875rem]">
          <WishlistSidebar
            activeMenu={activeMenu}
            onMenuChange={handleMenuChange}
            isReformer={isReformer}
          />

          <div className="flex-1">
            {isLoading ? (
              <div className="mt-[3.125rem]">로딩 중...</div>
            ) : !wishData?.success?.list || wishData.success.list.length === 0 ? (
              <EmptyWishlist />
            ) : activeMenu === 'custom' ? (
              <div className="grid grid-cols-3 gap-[1.875rem] mt-[3.125rem]">
                {wishData.success.list
                  .filter((item) => {
                    if (!isReformer && item.wishType === 'REQUEST') {
                      return false;
                    }
                    return true;
                  })
                  .map((item, index) => {
                    if (item.wishType === 'REQUEST') {
                      const detail = requestDetailsMap.get(item.itemId);
                      const priceRange = detail
                        ? `${detail.minBudget.toLocaleString('ko-KR')}원~${detail.maxBudget.toLocaleString('ko-KR')}원`
                        : `${item.price.toLocaleString('ko-KR')}원`;
                      const imgSrc = detail?.firstImage || item.content || '';
                      
                      return (
                        <RequestCard
                          key={`${item.itemId}-${index}`}
                          id={item.itemId}
                          imgSrc={imgSrc}
                          title={item.title}
                          priceRange={priceRange}
                          variant={isReformer ? 'reformer' : 'order'}
                          isWished={true}
                        />
                      );
                    } else if (item.wishType === 'PROPOSAL') {
                    const detail = proposalDetailsMap.get(item.itemId);
                    const imgSrc = detail?.firstImage || item.content || '';
                    
                    return (
                      <ProposalCard
                        key={`${item.itemId}-${index}`}
                        id={item.itemId}
                        imgSrc={imgSrc}
                        title={item.title}
                        price={`${item.price.toLocaleString('ko-KR')}원`}
                        rating={detail?.avgStar ?? item.avgStar ?? 0}
                        ratingDecimals={1}
                        reviewCountText={`(${detail?.reviewCount ?? item.reviewCount ?? 0})`}
                        nickname={item.name}
                        variant="order"
                        isWished={true}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[1.875rem] mt-[3.125rem]">
                {marketItems.map((item) => (
                  <MarketCard
                    key={item.item_id}
                    item={item}
                    hideLikeButton={isReformer}
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
