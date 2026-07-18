import { Icon } from "./Icon.jsx";
import { GENRES } from "../lib/movies.js";
import { cls } from "../lib/utils.js";

export default function FilterBar({ active, onChange, query, onQuery }) {
  return (
    <div className="sticky top-16 z-30 -mx-5 px-5 py-4 sm:-mx-8 sm:px-8 bg-ink-950/70 backdrop-blur-xl border-b border-white/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category tags */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {GENRES.map((g) => {
            const isActive = active === g;
            return (
              <button
                key={g}
                onClick={() => onChange(g)}
                className={cls(
                  "chip whitespace-nowrap",
                  isActive
                    ? "bg-gradient-to-r from-wave-400 to-wave-600 text-ink-950 shadow-[0_8px_24px_-10px_rgba(52,203,199,0.7)]"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                )}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative lg:w-72 shrink-0">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search movies..."
            className="input pl-10"
            aria-label="Search movies"
          />
        </div>
      </div>
    </div>
  );
}
