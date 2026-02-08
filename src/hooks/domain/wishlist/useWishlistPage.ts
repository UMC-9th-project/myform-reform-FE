import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishList, deleteWish } from '../../../api/wishlist';
import useAuthStore from '../../../stores/useAuthStore';
import type { WishlistItem } from '@/types/api/wishlist/wishlist';
import type { WishType } from '@/types/api/wishlist/wish';
import type { WishlistMenu } from '@/types/domain/wishlist/wishlist';

const getMenuFromUrl = (searchParams: URLSearchParams): WishlistMenu => {
  const menuParam = searchParams.get('menu');
  if (menuParam === 'wishlist' || menuParam === 'market' || menuParam === 'custom') {
    return menuParam;
  }
  return 'market';
};

const getWishType = (menu: WishlistMenu): WishType => {
  switch (menu) {
    case 'market':
      return 'ITEM';
    case 'custom':
      return 'REQUEST';
    default:
      return 'ITEM';
  }
};

export const useWishlistPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMenuFromUrl = getMenuFromUrl(searchParams);
  const [activeMenu, setActiveMenu] = useState<WishlistMenu>(activeMenuFromUrl);
  const userRole = useAuthStore((state) => state.role);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isReformer = userRole === 'reformer';

  useEffect(() => {
    const menuFromUrl = getMenuFromUrl(searchParams);
    if (menuFromUrl !== activeMenu) {
      setActiveMenu(menuFromUrl);
    }
  }, [searchParams, activeMenu]);

  const { data: wishData, isLoading } = useQuery({
    queryKey: ['wishlist', activeMenu, accessToken],
    queryFn: () => getWishList(getWishType(activeMenu)),
    enabled: !!accessToken,
  });

  const queryClient = useQueryClient();

  const deleteWishMutation = useMutation({
    mutationFn: deleteWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', activeMenu] });
    },
  });

  const transformWishItems = (): (WishlistItem & { itemId: string; wishType: WishType })[] => {
    if (!wishData?.success?.list) {
      return [];
    }

    return wishData.success.list.map((item, index) => ({
      id: parseInt(item.itemId.replace(/-/g, '').substring(0, 8), 16) || index + 1,
      itemId: item.itemId,
      wishType: item.wishType,
      image: item.content || '',
      title: item.title,
      price: item.price,
      rating: item.avgStar ?? 0,
      reviewCount: item.reviewCount ?? 0,
      seller: item.name,
    }));
  };

  const handleRemoveFromWishlist = (item: WishlistItem & { itemId: string; wishType: WishType }) => {
    deleteWishMutation.mutate({
      type: item.wishType,
      itemId: item.itemId,
    });
  };

  const handleMenuChange = (menu: WishlistMenu) => {
    setActiveMenu(menu);
    setSearchParams((prev: URLSearchParams) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('menu', menu);
      return newParams;
    });
  };

  const currentItems = transformWishItems();

  return {
    activeMenu,
    wishData,
    isLoading,
    isReformer,
    currentItems,
    handleMenuChange,
    handleRemoveFromWishlist,
  };
};
