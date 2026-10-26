// Danh sách thể loại khai báo dạng `as const` để vừa dùng làm dữ liệu (render nút lọc)
// vừa suy ra union type Category, tránh lặp chuỗi ở nhiều nơi.
export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  publishedYear: number;
  available: number; // số bản còn lại trong thư viện
  coverUrl: string;
}

// Utility type: dữ liệu gốc (seed) chưa có id và ảnh bìa, 2 trường này được sinh khi tạo mock data
export type BookSeed = Omit<Book, 'id' | 'coverUrl'>;

// Utility type: thông tin cần hiển thị ở khung sách đang mượn
export type BorrowedBookPreview = Pick<Book, 'id' | 'title' | 'author' | 'category' | 'publishedYear' | 'coverUrl'>;

// Utility type: số đầu sách cho mọi thể loại (Record bắt buộc đủ 3 khoá)
export type CategoryStats = Record<Category, number>;

// Bộ lọc thể loại có thêm lựa chọn "Tất cả"
export type CategoryFilter = Category | 'all';

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
