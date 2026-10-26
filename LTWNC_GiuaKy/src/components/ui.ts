// Class Tailwind dùng chung cho nút & khung — gom 1 chỗ để giữ giao diện trắng đen nhất quán

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'sm' | 'md';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors cursor-pointer ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ' +
  'disabled:cursor-not-allowed disabled:opacity-40';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-zinc-900 text-white enabled:hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:enabled:hover:bg-zinc-300',
  outline:
    'border border-zinc-300 bg-white text-zinc-900 enabled:hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:enabled:hover:bg-zinc-800',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-sm',
  md: 'px-3.5 py-2 text-sm',
};

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = ''): string {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${extra}`.trim();
}

export const CARD_CLASS =
  'rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900';

export const MUTED_TEXT = 'text-zinc-500 dark:text-zinc-400';
