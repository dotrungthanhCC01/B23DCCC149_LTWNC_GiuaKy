import { create } from 'zustand';
import type { CategoryFilter } from '../../types/book';

interface FilterState {
  keyword: string; // giá trị thô của ô tìm kiếm (debounce xử lý ở nơi lọc)
  category: CategoryFilter;
  setKeyword: (keyword: string) => void;
  setCategory: (category: CategoryFilter) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  keyword: '',
  category: 'all',
  setKeyword: (keyword) => set({ keyword }),
  setCategory: (category) => set({ category }),
}));
