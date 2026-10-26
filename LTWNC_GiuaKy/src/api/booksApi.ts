import type { ApiResult } from '../types/api';
import type { Book, BookSeed } from '../types/book';

const BOOK_SEEDS: readonly BookSeed[] = [
  // CNTT
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', publishedYear: 2008, available: 3 },
  { title: 'Lập trình TypeScript thực chiến', author: 'Nguyễn Văn An', category: 'CNTT', publishedYear: 2022, available: 2 },
  { title: 'Cấu trúc dữ liệu và giải thuật', author: 'Đỗ Xuân Lôi', category: 'CNTT', publishedYear: 2015, available: 1 },
  { title: 'You Don’t Know JS', author: 'Kyle Simpson', category: 'CNTT', publishedYear: 2014, available: 0 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt, David Thomas', category: 'CNTT', publishedYear: 2019, available: 2 },
  { title: 'Design Patterns', author: 'Erich Gamma và cộng sự', category: 'CNTT', publishedYear: 1994, available: 1 },
  { title: 'Refactoring', author: 'Martin Fowler', category: 'CNTT', publishedYear: 2018, available: 4 },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'CNTT', publishedYear: 2022, available: 2 },
  // Kinh tế
  { title: 'Kinh tế học vi mô', author: 'N. Gregory Mankiw', category: 'Kinh tế', publishedYear: 2020, available: 4 },
  { title: 'Cha giàu cha nghèo', author: 'Robert Kiyosaki', category: 'Kinh tế', publishedYear: 1997, available: 2 },
  { title: 'Nhà đầu tư thông minh', author: 'Benjamin Graham', category: 'Kinh tế', publishedYear: 1949, available: 0 },
  { title: 'Tư duy nhanh và chậm', author: 'Daniel Kahneman', category: 'Kinh tế', publishedYear: 2011, available: 3 },
  { title: 'Từ tốt đến vĩ đại', author: 'Jim Collins', category: 'Kinh tế', publishedYear: 2001, available: 1 },
  { title: 'Kinh tế học vĩ mô', author: 'N. Gregory Mankiw', category: 'Kinh tế', publishedYear: 2021, available: 2 },
  { title: 'Chiến lược đại dương xanh', author: 'W. Chan Kim, Renée Mauborgne', category: 'Kinh tế', publishedYear: 2005, available: 0 },
  { title: 'Freakonomics', author: 'Steven D. Levitt', category: 'Kinh tế', publishedYear: 2005, available: 2 },
  // Ngoại ngữ
  { title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ', publishedYear: 2019, available: 5 },
  { title: 'Hackers IELTS Reading', author: 'Hackers Academia', category: 'Ngoại ngữ', publishedYear: 2021, available: 1 },
  { title: 'Minna no Nihongo I', author: '3A Corporation', category: 'Ngoại ngữ', publishedYear: 2012, available: 3 },
  { title: 'Oxford Word Skills', author: 'Ruth Gairns, Stuart Redman', category: 'Ngoại ngữ', publishedYear: 2020, available: 2 },
  { title: 'Giáo trình Hán ngữ 1', author: 'Dương Ký Châu', category: 'Ngoại ngữ', publishedYear: 2018, available: 0 },
  { title: 'Cambridge IELTS 18', author: 'Cambridge University Press', category: 'Ngoại ngữ', publishedYear: 2023, available: 4 },
  { title: 'Korean Grammar in Use', author: 'Ahn Jean-myung', category: 'Ngoại ngữ', publishedYear: 2010, available: 1 },
  { title: 'Word Power Made Easy', author: 'Norman Lewis', category: 'Ngoại ngữ', publishedYear: 1949, available: 3 },
];

export const DEFAULT_DELAY_MS = 500;

export interface FetchBooksOptions {
  shouldFail?: boolean; // true → giả lập API lỗi
}

/**
 * API giả lập: trả về Promise sau 500ms.
 * Lỗi được trả về dưới dạng `{ ok: false, error }` thay vì reject,
 * để nơi gọi phân biệt bằng type guard `isApiSuccess`.
 */
export function fetchBooks(options: FetchBooksOptions = {}): Promise<ApiResult<Book[]>> {
  const { shouldFail = false } = options;

  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({ ok: false, error: 'Không thể tải danh sách sách. Vui lòng thử lại sau.' });
        return;
      }
      // Tạo mảng mới mỗi lần gọi để store không dùng chung tham chiếu với dữ liệu gốc
      const data: Book[] = BOOK_SEEDS.map((seed, index) => {
        const id = `book-${index + 1}`;
        // Ảnh bìa minh hoạ, seed theo id nên mỗi cuốn luôn cùng 1 ảnh
        return { id, coverUrl: `https://picsum.photos/seed/${id}/400/300`, ...seed };
      });
      resolve({ ok: true, data });
    }, DEFAULT_DELAY_MS);
  });
}
