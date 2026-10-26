// warning: vượt giới hạn mượn · error: API thất bại
export type NoticeKind = 'warning' | 'error';

// Thông báo hiển thị bằng toast.
// `id` tăng dần để 2 thông báo giống nội dung liên tiếp vẫn được coi là 2 sự kiện khác nhau.
export interface Notice {
  id: number;
  kind: NoticeKind;
  message: string;
}
