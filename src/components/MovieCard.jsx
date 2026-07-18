import { Icon } from "./Icon.jsx";
import { formatRuntime, formatPrice, ratingTone, cls } from "../lib/utils.js";

export default function MovieCard({ movie, onBook, index = 0 }) {
  return (
    <article
      className="group relative animate-pop"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
    >
      <div className="card overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-wave-400/30 group-hover:shadow-[0_24px_60px_-24px_rgba(52,203,199,0.35)]">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-ink-950/70 px-2.5 py-1 backdrop-blur-md ring-1 ring-white/10">
            <Icon name="star" className={cls("h-3.5 w-3.5", ratingTone(movie.rating))} />
            <span className={cls("text-xs font-bold", ratingTone(movie.rating))}>
              {Number(movie.rating).toFixed(1)}
            </span>
          </div>

          {/* Genre tag */}
          <div className="absolute top-3 right-3">
            <span className="chip border border-white/15 bg-ink-950/70 text-[10px] uppercase tracking-wider text-slate-200 backdrop-blur-md">
              {movie.genre}
            </span>
          </div>

          {/* Hover quick info */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200">
              <Icon name="clock" className="h-3.5 w-3.5 text-wave-300" />
              {formatRuntime(movie.runtime_min)}
            </span>
            <span className="text-sm font-bold text-gold-400">{formatPrice(movie.ticket_price)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-display text-base font-bold leading-snug text-white line-clamp-1">
            {movie.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[2rem]">
            {movie.description}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {formatRuntime(movie.runtime_min)}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <Icon name="ticket" className="h-3.5 w-3.5 text-wave-300" />
              {formatPrice(movie.ticket_price)}
            </span>
          </div>

          <button
            onClick={() => onBook(movie)}
            className="btn-primary mt-4 w-full tracking-wide"
          >
            BOOK NOW
            <Icon name="arrow-right" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
