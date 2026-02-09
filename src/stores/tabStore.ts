import { create } from 'zustand';

export type SellerTabType = '프로필 관리' | '판매 관리';

export interface SellerTabStore {
  activeTab: SellerTabType;
  setActiveTab: (tab: SellerTabType) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
}

export const useSellerTabStore = create<SellerTabStore>((set) => ({
  activeTab: '프로필 관리', // 초기 탭
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedOrderId: null,
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
}));

// ================== 일반 사용자 ============//

export type UserTabType = '내 정보' | '내가 작성한 글' | '구매 이력' | '나의 후기';

interface UserTabStore {
  activeTab: UserTabType;
  setActiveTab: (tab: UserTabType) => void;
  
  // 구매 내역 상세보기용
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  
  // 내가 작성한 후기 상세보기/수정용
  selectedReviewId: string | null;
  setSelectedReviewId: (id: string | null) => void;

  // 후기 작성 모달/페이지 제어용 (필요시 추가)
  isReviewModalOpen: boolean;
  setReviewModalOpen: (val: boolean) => void;
}

export const useUserTabStore = create<UserTabStore>((set) => ({
  activeTab: '내 정보',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedOrderId: null,
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
  selectedReviewId: null,
  setSelectedReviewId: (id) => set({selectedReviewId: id}),
  isReviewModalOpen: false, // 초기값
  setReviewModalOpen: (val: boolean) => set({ isReviewModalOpen: val }), // setter
  
}));