import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('chỉ cập nhật giá trị sau 300ms kể từ lần thay đổi cuối', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });
    expect(result.current).toBe('a');

    rerender({ value: 'ab' });
    act(() => jest.advanceTimersByTime(200));
    rerender({ value: 'abc' }); // gõ tiếp trước khi hết 300ms → timer cũ bị huỷ
    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe('a');

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe('abc');
  });
});
