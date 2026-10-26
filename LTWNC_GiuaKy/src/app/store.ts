import { combineReducers, configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import { borrowLimitMiddleware } from '../features/books/borrowLimitMiddleware';

export const rootReducer = combineReducers({
  books: booksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Hàm tạo store dùng chung cho app và test (mỗi test 1 store mới)
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(borrowLimitMiddleware),
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
