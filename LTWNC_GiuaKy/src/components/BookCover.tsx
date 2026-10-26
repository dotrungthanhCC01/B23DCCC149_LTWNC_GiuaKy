import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  src: string;
  title: string;
  className?: string;
}

/** Ảnh bìa lazy-load (chỉ tải khi gần viewport); lỗi mạng → hiện bìa thay thế. */
export function BookCover({ src, title, className = '' }: BookCoverProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`Bìa sách ${title}`}
        className={`flex items-center justify-center bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 ${className}`}
      >
        <BookOpen size={32} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Bìa sách ${title}`}
      loading="lazy"
      decoding="async"
      width={300}
      height={400}
      onError={() => setFailed(true)}
      className={`bg-zinc-200 object-cover dark:bg-zinc-800 ${className}`}
    />
  );
}
