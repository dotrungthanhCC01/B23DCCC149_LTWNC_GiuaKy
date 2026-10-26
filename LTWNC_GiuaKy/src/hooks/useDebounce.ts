import { useEffect, useState } from 'react';

/** Trả về `value` sau khi nó ngừng thay đổi trong `delay` ms. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Giá trị đổi trước khi hết hạn → huỷ timer cũ
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
