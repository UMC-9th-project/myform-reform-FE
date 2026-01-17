import { useState } from 'react';
import WishlistSidebar from '../../components/domain/wishlist/WishlistSidebar';
import WishlistItemCard from '../../components/domain/wishlist/WishlistItemCard';
import EmptyWishlist from '../../components/domain/wishlist/EmptyWishlist';
import type { WishlistItem } from '../../components/domain/wishlist/types';

// 이미지 URL - public 폴더의 이미지 사용
const IMAGE_URLS = {
  wsh1: '/wsh1.jpg',
  wsh2: '/wsh2.jpg',
  wsh3: '/wsh3.jpg',
  wsh4: '/wsh4.jpg',
  wsh5: '/wsh5.jpg',
};

const MOCK_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 1,
    image: IMAGE_URLS.wsh1,
    title:
      '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니...',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 2,
    image: IMAGE_URLS.wsh2,
    title:
      '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니...',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 3,
    image: IMAGE_URLS.wsh3,
    title:
      '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니...',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 4,
    image: IMAGE_URLS.wsh4,
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
    image: IMAGE_URLS.wsh5,
    title:
      '제 소중한 기아 쿠로미 유니폼 짐색으로 만 들어주실 리폼 장인을 찾아요',
    price: 30000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 2,
    image: IMAGE_URLS.wsh5,
    title:
      '제 소중한 기아 쿠로미 유니폼 짐색으로 만 들어주실 리폼 장인을 찾아요',
    price: 30000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 3,
    image: IMAGE_URLS.wsh5,
    title:
      '제 소중한 기아 쿠로미 유니폼 짐색으로 만 들어주실 리폼 장인을 찾아요',
    price: 30000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 4,
    image: IMAGE_URLS.wsh5,
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
  );
};

export default Wishlist;
