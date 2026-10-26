import { Search } from 'lucide-react';
import { CATEGORIES, type CategoryFilter } from '../../types/book';
import { useFilterStore } from './useFilterStore';

const FILTER_OPTIONS: ReadonlyArray<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function FilterBar() {
  const keyword = useFilterStore((s) => s.keyword);
  const category = useFilterStore((s) => s.category);
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const setCategory = useFilterStore((s) => s.setCategory);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <label className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
        <Search size={18} className="shrink-0" aria-hidden="true" />
        <span className="sr-only">Tìm theo tên sách hoặc tác giả</span>
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo tên sách hoặc tác giả..."
          className="min-w-0 flex-1 bg-transparent py-2.5 text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </label>

      <div role="group" aria-label="Lọc theo thể loại" className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const active = category === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(opt.value)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-100'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
