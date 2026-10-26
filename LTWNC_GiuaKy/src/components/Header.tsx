import { NavLink } from "react-router-dom";
import { ChartColumn, Library, List } from "lucide-react";
import { ThemeToggle } from "../features/theme/ThemeToggle";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
    isActive
      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
  }`;

export function Header() {
  return (
    // Header nổi: hẹp 70% (màn lớn), cách mép trên, viền 4 phía + đổ bóng nên không dính vào màn hình
    <header className="sticky top-3 z-40 mx-auto mt-3 w-[calc(100%-2rem)] rounded-2xl border border-zinc-200 bg-white/85 shadow-lg shadow-zinc-900/5 backdrop-blur lg:w-[96%] dark:border-zinc-800 dark:bg-zinc-900/85 dark:shadow-black/30">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-5">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="grid size-7 place-items-center rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <Library size={16} aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">Thư viện sách</span>
        </NavLink>

        <nav aria-label="Điều hướng chính" className="flex items-center gap-1">
          <NavLink to="/" end className={navClass} aria-label="Danh sách">
            <List size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Danh sách</span>
          </NavLink>
          <NavLink to="/stats" className={navClass} aria-label="Thống kê">
            <ChartColumn size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Thống kê</span>
          </NavLink>
          <span
            className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800"
            aria-hidden="true"
          />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
