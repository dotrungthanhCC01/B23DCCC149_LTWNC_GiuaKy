import { MAX_BORROWED_BOOKS } from '../features/books/borrowLimitMiddleware';

// Gáy sách trang trí: [chiều cao (%), độ đậm] — chỉ là hình minh hoạ, không mang dữ liệu
const SPINES: ReadonlyArray<readonly [number, string]> = [
  [70, 'bg-white/90'],
  [88, 'bg-white/40'],
  [62, 'bg-white/70'],
  [95, 'bg-white/20'],
  [78, 'bg-white/60'],
  [84, 'bg-white/30'],
  [66, 'bg-white/80'],
];

/** Banner đầu trang Danh sách: tiêu đề trang + giới thiệu quy định mượn. */
export function HomeBanner() {
  return (
    <section className="relative flex items-end justify-between gap-6 overflow-hidden rounded-2xl bg-zinc-900 px-6 py-7 text-white sm:px-8 dark:border dark:border-zinc-800">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Thư viện sách</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Danh sách sách</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Tìm theo tên sách hoặc tác giả, lọc theo thể loại và mượn ngay. Mỗi sinh viên được mượn tối đa{' '}
          {MAX_BORROWED_BOOKS} cuốn cùng lúc.
        </p>
      </div>

      <div className="hidden h-24 shrink-0 items-end gap-1.5 md:flex" aria-hidden="true">
        {SPINES.map(([height, shade]) => (
          <span key={height}className={`w-5 rounded-sm ${shade}`} style={{ height: `${height}%` }} />
        ))}
        <span className="h-[55%] w-5 origin-bottom-left rotate-12 rounded-sm bg-white/50" />
      </div>
    </section>
  );
}
