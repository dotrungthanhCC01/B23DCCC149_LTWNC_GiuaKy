import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchBooks as fetchBooksApi, type FetchBooksOptions } from '../../api/booksApi';
import { isApiSuccess } from '../../types/api';
import { CATEGORIES, type Book, type BorrowedBookPreview, type CategoryStats, type LoadStatus } from '../../types/book';
import type { Notice, NoticeKind } from '../../types/notice';

export interface BooksState {
  items: Book[];
  borrowedIds: string[];
  status: LoadStatus;
  error: string | null;
  notice: Notice | null; // cảnh báo / lỗi mới nhất → component Toaster hiển thị thành toast
}

// Kiểu state tối thiểu mà slice cần — dùng cho thunk/middleware/selector
// thay vì import RootState từ store (tránh vòng phụ thuộc store ↔ slice).
export interface BooksRootState {
  books: BooksState;
}

export const initialState: BooksState = {
  items: [],
  borrowedIds: [],
  status: 'idle',
  error: null,
  notice: null,
};

function setNotice(state: BooksState, kind: NoticeKind, message: string) {
  state.notice = { id: (state.notice?.id ?? 0) + 1, kind, message };
}

export const fetchBooks = createAsyncThunk<
  Book[],
  FetchBooksOptions | undefined,
  { state: BooksRootState; rejectValue: string }
>(
  'books/fetchAll',
  async (options, { rejectWithValue }) => {
    const result = await fetchBooksApi(options);
    if (isApiSuccess(result)) return result.data;
    return rejectWithValue(result.error);
  },
  {
    // Không gọi lại khi đang tải (StrictMode chạy effect 2 lần ở dev)
    condition: (_options, { getState }) => getState().books.status !== 'loading',
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook(state, action: PayloadAction<string>) {
      const book = state.items.find((b) => b.id === action.payload);
      // Không tồn tại / hết bản / đã mượn cuốn này rồi → giữ nguyên state
      if (!book || book.available <= 0 || state.borrowedIds.includes(book.id)) return;
      book.available -= 1;
      state.borrowedIds.push(book.id);
    },
    returnBook(state, action: PayloadAction<string>) {
      if (!state.borrowedIds.includes(action.payload)) return;
      const book = state.items.find((b) => b.id === action.payload);
      if (book) book.available += 1;
      state.borrowedIds = state.borrowedIds.filter((id) => id !== action.payload);
    },
    // Chỉ được dispatch bởi borrowLimitMiddleware khi chặn lượt mượn
    borrowLimitExceeded(state, action: PayloadAction<string>) {
      setNotice(state, 'warning', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi không xác định';
        setNotice(state, 'error', state.error);
      });
  },
});

export const { borrowBook, returnBook, borrowLimitExceeded } = booksSlice.actions;
export default booksSlice.reducer;

// ===== Selectors =====
export const selectBooks = (state: BooksRootState) => state.books.items;
export const selectBorrowedIds = (state: BooksRootState) => state.books.borrowedIds;
export const selectBooksStatus = (state: BooksRootState) => state.books.status;
export const selectBooksError = (state: BooksRootState) => state.books.error;
export const selectNotice = (state: BooksRootState) => state.books.notice;

// Giữ thứ tự mượn; createSelector để không tạo mảng mới khi state không đổi
export const selectBorrowedBooks = createSelector(
  [selectBooks, selectBorrowedIds],
  (books, ids): BorrowedBookPreview[] =>
    ids
      .map((id) => books.find((b) => b.id === id))
      .filter((b): b is Book => b !== undefined)
      .map(({ id, title, author, category, publishedYear, coverUrl }) => ({
        id,
        title,
        author,
        category,
        publishedYear,
        coverUrl,
      })),
);

export const selectCategoryStats = createSelector([selectBooks], (books): CategoryStats => {
  const stats = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as CategoryStats;
  for (const book of books) stats[book.category] += 1;
  return stats;
});
