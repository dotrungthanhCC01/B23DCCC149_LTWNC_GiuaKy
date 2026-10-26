import { LoaderCircle } from 'lucide-react';
import { MUTED_TEXT } from './ui';

export function LoadingState({ message = 'Đang tải...' }: { message?: string }) {
  return (
    <div role="status" className={`flex flex-col items-center gap-3 py-20 ${MUTED_TEXT}`}>
      <LoaderCircle size={32} className="animate-spin" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
