import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, borrowLimitExceeded, type BooksRootState } from './booksSlice';

export const MAX_BORROWED_BOOKS = 3;

/**
 * Middleware chặn action `books/borrowBook` khi sinh viên đã mượn đủ 3 cuốn.
 * Action bị chặn sẽ KHÔNG tới reducer; thay vào đó dispatch action cảnh báo.
 */
// Tham số generic đầu `{}`: middleware không mở rộng kiểu dispatch (theo docs Redux)
export const borrowLimitMiddleware: Middleware<{}, BooksRootState> = (api) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const { borrowedIds } = api.getState().books;
    const isAlreadyBorrowed = borrowedIds.includes(action.payload);

    if (!isAlreadyBorrowed && borrowedIds.length >= MAX_BORROWED_BOOKS) {
      api.dispatch(
        borrowLimitExceeded(
          `Bạn chỉ được mượn tối đa ${MAX_BORROWED_BOOKS} cuốn cùng lúc. Hãy trả bớt sách trước khi mượn thêm.`,
        ),
      );
      return action;
    }
  }
  return next(action);
};
