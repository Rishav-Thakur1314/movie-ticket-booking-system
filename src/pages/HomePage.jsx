import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import FilterBar from "../components/FilterBar.jsx";
import MovieCard from "../components/MovieCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { useMovies } from "../lib/movies.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Icon } from "../components/Icon.jsx";

export default function HomePage() {
  const { movies, loading, error } = useMovies();
  const { isAuthed } = useAuth();
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [booking, setBooking] = useState(null);
  const [searchParams] = useSearchParams();

  const featured = movies.find((m) => m.featured) ?? movies[0] ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movies.filter((m) => {
      const genreMatch =
        active === "All" || m.genre === active || (m.genres && m.genres.includes(active));
      const queryMatch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        (m.director && m.director.toLowerCase().includes(q));
      return genreMatch && queryMatch;
    });
  }, [movies, active, query]);

  function openBooking(movie) {
    setBooking(movie);
  }

  function closeBooking() {
    setBooking(null);
  }

  const focusTitle = searchParams.get("focus");

  return (
    <div>
      <Hero movie={featured} onBook={openBooking} />

      <main className="container-x">
        <FilterBar active={active} onChange={setActive} query={query} onQuery={setQuery} />

        <section className="py-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">
                {active === "All" ? "All Movies" : active}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {loading
                  ? "Loading films..."
                  : `${filtered.length} film${filtered.length !== 1 ? "s" : ""} ${query ? `matching “${query}”` : "now showing"}`}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-center">
              <p className="text-sm text-rose-200">Couldn’t load movies: {error}</p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="card shimmer-bg animate-shimmer h-[420px] rounded-3xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card rounded-3xl p-12 text-center">
              <Icon name="film" className="mx-auto h-10 w-10 text-slate-600" />
              <h3 className="mt-4 font-display text-lg font-bold text-white">No movies found</h3>
              <p className="mt-1 text-sm text-slate-400">
                Try a different category or search term.
              </p>
              <button
                onClick={() => { setActive("All"); setQuery(""); }}
                className="btn-ghost mt-4"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((m, i) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  index={i}
                  onBook={openBooking}
                />
              ))}
            </div>
          )}
        </section>

        {/* CTA strip when not authed */}
        {!isAuthed && (
          <section className="my-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-ink-800 to-ink-700 p-8 sm:p-10">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  Create an account to book tickets
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Sign up in seconds and keep all your bookings in one place.
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/signup" className="btn-primary">Sign up free</Link>
                <Link to="/login" className="btn-ghost">Sign in</Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {booking && (
        <BookingModal movie={booking} onClose={closeBooking} onBooked={() => {}} />
      )}

      {focusTitle && !booking && (
        <Highlight title={focusTitle} movies={movies} onBook={openBooking} />
      )}
    </div>
  );
}

function Highlight({ title, movies, onBook }) {
  const m = movies.find((x) => x.title.toLowerCase() === title.toLowerCase());
  if (!m) return null;
  return (
    <div className="container-x mb-10">
      <div className="card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center">
        <img src={m.poster_url} alt={m.title} className="h-28 w-20 rounded-xl object-cover" />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-wave-300">Movie details</p>
          <h3 className="font-display text-lg font-bold text-white">{m.title}</h3>
          <p className="mt-1 text-sm text-slate-400 line-clamp-2">{m.description}</p>
        </div>
        <button onClick={() => onBook(m)} className="btn-gold">Book Now</button>
      </div>
    </div>
  );
}
