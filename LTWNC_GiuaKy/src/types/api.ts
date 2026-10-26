// Kết quả API dạng discriminated union, phân biệt bằng thuộc tính `ok`
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

// Type guard: sau khi kiểm tra, TypeScript thu hẹp kiểu về ApiSuccess<T> để truy cập `data`
export function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.ok;
}
