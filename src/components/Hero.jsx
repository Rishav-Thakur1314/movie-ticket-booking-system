import { Link } from "react-router-dom";
import { Icon } from "./Icon.jsx";
import { formatRuntime, ratingTone, cls } from "../lib/utils.js";

export default function Hero({ movie, onBook }) {
  if (!movie) {
    return (
      <section className="container-x pt-10">
        <div className="card shimmer-bg animate-shimmer h-[420px] rounded-3xl" />
      </section>
    );
  }

  const backdrop = movie.backdrop_url || movie.poster_url;

  return (
    <section className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src={backdrop}
          alt=""
          className="h-full w-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />
      </div>

      {/* Floating glow accents */}
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-wave-500/20 blur-3xl animate-glow" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl animate-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container-x relative pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Text */}
          <div className="animate-slideUp">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-wave-400/30 bg-wave-400/10 px-3.5 py-1.5">
              <Icon name="sparkles" className="h-4 w-4 text-gold-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-wave-200">
                Featured This Week
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className={cls("inline-flex items-center gap-1.5 font-semibold", ratingTone(movie.rating))}>
                <Icon name="star" className="h-4 w-4" />
                {Number(movie.rating).toFixed(1)}
              </span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Icon name="clock" className="h-4 w-4 text-slate-400" />
                {formatRuntime(movie.runtime_min)}
              </span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Icon name="calendar" className="h-4 w-4 text-slate-400" />
                {movie.release_year ?? "2025"}
              </span>
              <span className="chip border border-white/15 bg-white/5 text-slate-200">
                {movie.genre}
              </span>
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              {movie.description}
            </p>

            <div className="mt-4 text-sm text-slate-400">
              Directed by <span className="text-slate-200">{movie.director || "—"}</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={() => onBook(movie)} className="btn-gold text-base px-7 py-3">
                <Icon name="ticket" className="h-5 w-5" />
                Book Now
              </button>
              <Link to={`/?focus=${encodeURIComponent(movie.title)}`} className="btn-ghost text-base px-6 py-3">
                <Icon name="play" className="h-4 w-4" />
                View details
              </Link>
            </div>
          </div>

          {/* Poster card */}
          <div className="hidden lg:block animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <div className="relative mx-auto max-w-xs animate-floaty">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-wave-400/30 to-gold-400/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 glow-ring">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="aspect-[2/3] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-wave-200">
                      {movie.genre}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold-400">
                      <Icon name="star" className="h-3.5 w-3.5" />
                      {Number(movie.rating).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
