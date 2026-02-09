import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishList, deleteWish } from '../../../api/wishlist';
import { getReformRequestDetail } from '../../../api/order/reformRequest';
import { getReformProposalDetail } from '../../../api/order/reformProposal';
import useAuthStore from '../../../stores/useAuthStore';
import type { WishlistItem } from '@/types/api/wishlist/wishlist';
import type { WishType, GetWishListResponse } from '@/types/api/wishlist/wish';
import type { WishlistMenu } from '@/types/domain/wishlist/wishlist';
import type { GetReformRequestDetailResponse } from '@/types/api/order/reformRequest';
import type { GetReformProposalDetailResponse } from '@/types/api/order/reformProposal';

const getMenuFromUrl = (searchParams: URLSearchParams): WishlistMenu => {
  const menuParam = searchParams.get('menu');
  if (menuParam === 'wishlist' || menuParam === 'market' || menuParam === 'custom') {
    return menuParam;
  }
  return 'market';
};

const getWishType = (menu: WishlistMenu, isReformer: boolean): WishType => {
  switch (menu) {
    case 'market':
      return 'ITEM';
    case 'custom':
      return isReformer ? 'REQUEST' : 'PROPOSAL';
    default:
      return 'ITEM';
  }
};

export const useWishlistPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { data: wishData, isLoading, error: wishError } = useQuery({
    queryKey: ['wishlist', activeMenu, accessToken, isReformer],
    queryFn: () => getWishList(getWishType(activeMenu, isReformer)),
    enabled: !!accessToken && !(activeMenu === 'market' && isReformer),
    placeholderData: (previousData: GetWishListResponse | undefined) => previousData,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (wishError && typeof wishError === 'object' && 'response' in wishError) {
      const axiosError = wishError as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        navigate('/login/type');
      }
    }
  }, [wishError, navigate]);

  const { data: proposalWishData, isLoading: isLoadingProposal, error: proposalError } = useQuery({
    queryKey: ['wishlist', 'PROPOSAL', accessToken, 'custom'],
    queryFn: () => getWishList('PROPOSAL'),
    enabled: !!accessToken && activeMenu === 'custom' && !isReformer,
    retry: false,
    placeholderData: (previousData: GetWishListResponse | undefined) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const combinedWishData = useMemo(() => {
    if (activeMenu === 'custom' && !isReformer) {
      const requestList = wishData?.success?.list || [];
      if (proposalWishData?.success?.list && !proposalError) {
        const proposalList = proposalWishData.success.list;
        return {
          ...wishData,
          success: {
            list: [...requestList, ...proposalList],
          },
        };
      }
      return wishData;
    }
    return wishData;
  }, [wishData, proposalWishData, activeMenu, isReformer, proposalError]);

  const requestItemIds = useMemo(() => {
    if (activeMenu !== 'custom' || !combinedWishData?.success?.list) {
      return [];
    }
    return combinedWishData.success.list
      .filter((item) => item.wishType === 'REQUEST')
      .map((item) => item.itemId);
  }, [combinedWishData, activeMenu]);

  const proposalItemIds = useMemo(() => {
    if (activeMenu !== 'custom' || !combinedWishData?.success?.list) {
      return [];
    }
    return combinedWishData.success.list
      .filter((item) => item.wishType === 'PROPOSAL')
      .map((item) => item.itemId);
  }, [combinedWishData, activeMenu]);

  const requestDetailsQueries = useQueries({
    queries: requestItemIds.map((itemId) => ({
      queryKey: ['reform-request-detail', itemId] as const,
      queryFn: () => getReformRequestDetail(itemId),
      enabled: !!itemId && !!accessToken,
      staleTime: 5 * 60 * 1000,
      placeholderData: (previousData: GetReformRequestDetailResponse | undefined) => previousData,
    })),
  });

  const proposalDetailsQueries = useQueries({
    queries: proposalItemIds.map((itemId) => ({
      queryKey: ['reform-proposal-detail', itemId] as const,
      queryFn: () => getReformProposalDetail(itemId),
      enabled: !!itemId && !!accessToken,
      staleTime: 5 * 60 * 1000,
      placeholderData: (previousData: GetReformProposalDetailResponse | undefined) => previousData,
    })),
  });

  const requestDetailsMap = useMemo(() => {
    const map = new Map<string, { minBudget: number; maxBudget: number; firstImage?: string }>();
    requestDetailsQueries.forEach((query, index) => {
      const itemId = requestItemIds[index];
      if (itemId && query.data?.success) {
        const images = query.data.success.images || [];
        const sortedImages = [...images].sort((a, b) => a.photo_order - b.photo_order);
        const firstImage = sortedImages.length > 0 ? sortedImages[0].photo : undefined;
        
        map.set(itemId, {
          minBudget: query.data.success.minBudget,
          maxBudget: query.data.success.maxBudget,
          firstImage,
        });
      }
    });
    return map;
  }, [requestDetailsQueries, requestItemIds]);

  const proposalDetailsMap = useMemo(() => {
    const map = new Map<string, { avgStar: number; reviewCount: number; firstImage?: string }>();
    proposalDetailsQueries.forEach((query, index) => {
      const itemId = proposalItemIds[index];
      if (itemId && query.data?.success) {
        const profile = query.data.success.profile;
        const images = query.data.success.images || [];
        const sortedImages = [...images].sort((a, b) => a.photo_order - b.photo_order);
        const firstImage = sortedImages.length > 0 ? sortedImages[0].photo : undefined;
        
        map.set(itemId, {
          avgStar: profile?.avgStar ?? 0,
          reviewCount: profile?.reviewCount ?? 0,
          firstImage,
        });
      }
    });
    return map;
  }, [proposalDetailsQueries, proposalItemIds]);

  const queryClient = useQueryClient();

  const deleteWishMutation = useMutation({
    mutationFn: deleteWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', activeMenu] });
    },
  });

  const transformWishItems = (): (WishlistItem & { itemId: string; wishType: WishType })[] => {
    if (!combinedWishData?.success?.list) {
      return [];
    }

    return combinedWishData.success.list.map((item, index) => ({
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
    wishData: combinedWishData,
    isLoading: isLoading || isLoadingProposal,
    isReformer,
    currentItems,
    requestDetailsMap,
    proposalDetailsMap,
    handleMenuChange,
    handleRemoveFromWishlist,
  };
};
