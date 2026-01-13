import { create } from 'zustand';

export type TabType = '프로필 관리' | '판매 관리' | '수익 관리';

interface TabStore {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: '판매 관리', // 초기 탭
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedOrderId: null,
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
}));
