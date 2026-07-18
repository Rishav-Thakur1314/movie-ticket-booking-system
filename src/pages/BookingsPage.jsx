import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Icon } from "../components/Icon.jsx";
import { formatPrice, formatDateLong, cls } from "../lib/utils.js";

export default function BookingsPage() {
  const { isAuthed, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | done | error
  const [errorMsg, setErrorMsg] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!isAuthed) return;
    let active = true;
    (async () => {
      setLoadState("loading");
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        setErrorMsg(error.message);
        setLoadState("error");
      } else {
        setBookings(data ?? []);
        setLoadState("done");
      }
    })();
    return () => { active = false; };
  }, [isAuthed]);

  if (loading) {
    return (
      <div className="container-x py-20 text-center text-slate-400">Loading…</div>
    );
  }
  if (!isAuthed) {
    return <Navigate to="/login?redirect=/bookings" replace />;
  }

  async function cancelBooking(id) {
    setCancelling(id);
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    setCancelling(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  const totalSpent = bookings.reduce((s, b) => s + Number(b.total_price), 0);
  const totalSeats = bookings.reduce((s, b) => s + b.num_seats, 0);

  return (
    <div className="container-x py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          All your cinema tickets in one place.
        </p>
      </header>

      {bookings.length > 0 && (
        <div className="mb-8 grid grid-cols-3 gap-3 sm:max-w-md">
          <Stat label="Bookings" value={bookings.length} />
          <Stat label="Seats" value={totalSeats} />
          <Stat label="Spent" value={formatPrice(totalSpent)} />
        </div>
      )}

      {loadState === "loading" && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card shimmer-bg animate-shimmer h-28 rounded-3xl" />
          ))}
        </div>
      )}

      {loadState === "error" && (
        <div className="card rounded-3xl p-8 text-center">
          <p className="text-sm text-rose-300">{errorMsg}</p>
        </div>
      )}

      {loadState === "done" && bookings.length === 0 && (
        <div className="card rounded-3xl p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5">
            <Icon name="ticket" className="h-7 w-7 text-slate-500" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-white">No bookings yet</h3>
          <p className="mt-1 text-sm text-slate-400">
            Browse what’s showing and book your first ticket.
          </p>
          <Link to="/" className="btn-primary mt-5 inline-flex">
            Browse movies
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      )}

      {loadState === "done" && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <BookingRow
              key={b.id}
              booking={b}
              onCancel={cancelBooking}
              cancelling={cancelling === b.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card rounded-2xl p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function BookingRow({ booking, onCancel, cancelling }) {
  const confirmed = booking.status === "confirmed";
  return (
    <div className="card group flex flex-col gap-4 rounded-3xl p-4 transition hover:border-wave-400/30 sm:flex-row sm:items-center">
      <img
        src={booking.poster_url}
        alt={booking.movie_title}
        className="h-32 w-24 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold text-white truncate">{booking.movie_title}</h3>
          <span
            className={cls(
              "chip text-[10px] uppercase tracking-wider",
              confirmed
                ? "border border-wave-400/30 bg-wave-400/10 text-wave-200"
                : "border border-rose-400/30 bg-rose-400/10 text-rose-200"
            )}
          >
            {booking.status}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="h-3.5 w-3.5 text-wave-300" />
            {formatDateLong(booking.show_date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" className="h-3.5 w-3.5 text-wave-300" />
            {booking.show_time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="ticket" className="h-3.5 w-3.5 text-wave-300" />
            {booking.seats.join(", ")}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {booking.num_seats} seat{booking.num_seats > 1 ? "s" : ""}
          </span>
          <span className="font-display text-sm font-bold text-gold-400">{formatPrice(booking.total_price)}</span>
          <span className="ml-auto font-mono text-[10px] text-slate-600">
            #{booking.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 sm:flex-col">
        <button
          onClick={() => onCancel(booking.id)}
          disabled={cancelling}
          className="btn-ghost text-xs text-rose-300 hover:border-rose-400/30 hover:bg-rose-400/10"
        >
          <Icon name="trash" className="h-3.5 w-3.5" />
          {cancelling ? "Cancelling…" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
