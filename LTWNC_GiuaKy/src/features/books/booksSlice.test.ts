import type { Book } from '../../types/book';
import { makeStore } from '../../app/store';
import booksReducer, {
  borrowBook,
  fetchBooks,
  initialState,
  returnBook,
  selectCategoryStats,
  type BooksState,
} from './booksSlice';

const makeBook = (override: Partial<Book> = {}): Book => ({
  id: 'b1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  category: 'CNTT',
  publishedYear: 2008,
  available: 2,
  coverUrl: 'https://example.com/cover.jpg',
  ...override,
});

const makeState = (override: Partial<BooksState> = {}): BooksState => ({
  ...initialState,
  status: 'succeeded',
  items: [makeBook()],
  ...override,
});

describe('booksSlice reducer', () => {
  it('trả về initialState khi nhận action không xác định', () => {
    expect(booksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchBooks (3 trạng thái)', () => {
    it('pending → status "loading" và xoá lỗi cũ', () => {
      const state = booksReducer(
        makeState({ status: 'failed', error: 'lỗi cũ' }),
        fetchBooks.pending('req-1', undefined),
      );
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('fulfilled → lưu danh sách sách và status "succeeded"', () => {
      const books = [makeBook(), makeBook({ id: 'b2', title: 'Kinh tế học' })];
      const state = booksReducer({ ...initialState, status: 'loading' }, fetchBooks.fulfilled(books, 'req-1', undefined));
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(books);
    });

    it('rejected → status "failed" và lưu thông báo lỗi từ rejectWithValue', () => {
      const action = fetchBooks.rejected(null, 'req-1', undefined, 'API lỗi');
      const state = booksReducer({ ...initialState, status: 'loading' }, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('API lỗi');
      expect(state.notice).toMatchObject({ kind: 'error', message: 'API lỗi' });
    });
  });

  describe('borrowBook', () => {
    it('giảm số bản còn lại 1 và thêm id vào danh sách đang mượn', () => {
      const state = booksReducer(makeState(), borrowBook('b1'));
      expect(state.items[0].available).toBe(1);
      expect(state.borrowedIds).toEqual(['b1']);
    });

    it('giữ nguyên state khi sách đã hết bản', () => {
      const before = makeState({ items: [makeBook({ available: 0 })] });
      expect(booksReducer(before, borrowBook('b1'))).toEqual(before);
    });

    it('giữ nguyên state khi id không tồn tại', () => {
      const before = makeState();
      expect(booksReducer(before, borrowBook('khong-ton-tai'))).toEqual(before);
    });
  });

  describe('returnBook', () => {
    it('tăng số bản còn lại 1 và xoá id khỏi danh sách đang mượn', () => {
      const before = makeState({ items: [makeBook({ available: 1 })], borrowedIds: ['b1'] });
      const state = booksReducer(before, returnBook('b1'));
      expect(state.items[0].available).toBe(2);
      expect(state.borrowedIds).toEqual([]);
    });

    it('giữ nguyên state khi trả cuốn chưa mượn', () => {
      const before = makeState();
      expect(booksReducer(before, returnBook('b1'))).toEqual(before);
    });
  });
});

describe('selectCategoryStats', () => {
  it('đếm số đầu sách theo từng thể loại, thể loại trống = 0', () => {
    const state = makeState({
      items: [makeBook(), makeBook({ id: 'b2' }), makeBook({ id: 'b3', category: 'Kinh tế' })],
    });
    expect(selectCategoryStats({ books: state })).toEqual({ CNTT: 2, 'Kinh tế': 1, 'Ngoại ngữ': 0 });
  });
});

describe('borrowLimitMiddleware', () => {
  it('chặn mượn cuốn thứ 4 và đặt cảnh báo', () => {
    const items = ['b1', 'b2', 'b3', 'b4'].map((id) => makeBook({ id }));
    const store = makeStore({ books: makeState({ items }) });

    ['b1', 'b2', 'b3', 'b4'].forEach((id) => store.dispatch(borrowBook(id)));

    const { books } = store.getState();
    expect(books.borrowedIds).toEqual(['b1', 'b2', 'b3']);
    expect(books.items.find((b) => b.id === 'b4')?.available).toBe(2); // không bị trừ
    expect(books.notice).toMatchObject({ kind: 'warning', message: expect.stringMatching(/tối đa 3 cuốn/) });
  });

  it('cho mượn tiếp sau khi trả bớt 1 cuốn', () => {
    const items = ['b1', 'b2', 'b3', 'b4'].map((id) => makeBook({ id }));
    const store = makeStore({ books: makeState({ items, borrowedIds: ['b1', 'b2', 'b3'] }) });

    store.dispatch(borrowBook('b4'));
    store.dispatch(returnBook('b1'));
    store.dispatch(borrowBook('b4'));

    expect(store.getState().books.borrowedIds).toEqual(['b2', 'b3', 'b4']);
  });
});
