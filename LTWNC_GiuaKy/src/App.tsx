import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';
import { Toaster } from './components/Toaster';
import { fetchBooks } from './features/books/booksSlice';
import HomePage from './pages/HomePage';

// Trang Thống kê ít dùng hơn → tách chunk riêng, chỉ tải khi vào /stats
const StatsPage = lazy(() => import('./features/stats/StatsPage'));

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Thêm ?fail vào URL để giả lập API lỗi (vd: http://localhost:5173/?fail)
    const shouldFail = new URLSearchParams(window.location.search).has('fail');
    dispatch(fetchBooks({ shouldFail }));
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingState message="Đang tải trang..." />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Suspense>
      </main>
      <Toaster />
    </>
  );
}
