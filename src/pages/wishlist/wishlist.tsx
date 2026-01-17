import { useState } from 'react';
import Layout from '../../components/layout/PageLayout';
import WishlistSidebar from '../../components/domain/wishlist/WishlistSidebar';
import WishlistItemCard from '../../components/domain/wishlist/WishlistItemCard';
import EmptyWishlist from '../../components/domain/wishlist/EmptyWishlist';
import type { WishlistItem } from '../../components/domain/wishlist/types';
import wsh1 from '../../components/domain/wishlist/wsh1.jpg';
import wsh2 from '../../components/domain/wishlist/wsh2.jpg';
import wsh3 from '../../components/domain/wishlist/wsh3.jpg';
import wsh4 from '../../components/domain/wishlist/wsh4.jpg';
import wsh5 from '../../components/domain/wishlist/wsh5.jpg';

const MOCK_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 1,
    image: wsh1,
    title:
      '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니...',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 2,
    image: wsh2,
    title:
      '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니...',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 3,
    image: wsh3,
    title:
      '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니...',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 4,
    image: wsh4,
    title:
      '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니...',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
];

const MOCK_CUSTOM_ITEMS: WishlistItem[] = [
  {
    id: 1,
    image: wsh5,
    title:
      '제 소중한 기아 쿠로미 유니폼 짐색으로 만 들어주실 리폼 장인을 찾아요',
    price: 30000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 2,
    image: wsh5,
    title:
      '제 소중한 기아 쿠로미 유니폼 짐색으로 만 들어주실 리폼 장인을 찾아요',
    price: 30000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 3,
    image: wsh5,
    title:
      '제 소중한 기아 쿠로미 유니폼 짐색으로 만 들어주실 리폼 장인을 찾아요',
    price: 30000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 4,
    image: wsh5,
    title:
      '제 소중한 기아 쿠로미 유니폼 짐색으로 만 들어주실 리폼 장인을 찾아요',
    price: 30000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
];

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] =
    useState<WishlistItem[]>(MOCK_WISHLIST_ITEMS);
  const [activeMenu, setActiveMenu] = useState<
    'wishlist' | 'market' | 'custom'
  >('market');

  const handleRemoveFromWishlist = (id: number) => {
    if (activeMenu === 'custom') {
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    } else {
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    }
  };

  const handleMenuChange = (menu: 'wishlist' | 'market' | 'custom') => {
    setActiveMenu(menu);
    if (menu === 'custom') {
      setWishlistItems(MOCK_CUSTOM_ITEMS);
    } else {
      setWishlistItems(MOCK_WISHLIST_ITEMS);
    }
  };

  const currentItems = wishlistItems;

  return (
    <Layout
      showHeader={true}
      showNavbar={true}
      showFooter={true}
      footerVariant="light"
    >
      <div className="bg-white pb-[7.4375rem]">
        <div className="px-[3.125rem] pt-[1.875rem]"></div>

        {/* 위시리스트 컨텐츠 영역 */}
        <div className="px-[3.125rem]">
          <div className="flex gap-[1.875rem]">
            <WishlistSidebar
              activeMenu={activeMenu}
              onMenuChange={handleMenuChange}
            />

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1">
              {currentItems.length === 0 ? (
                <EmptyWishlist />
              ) : (
                <div className="grid grid-cols-3 gap-[1.875rem] mt-[3.125rem]">
                  {currentItems.map((item) => (
                    <WishlistItemCard
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveFromWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
