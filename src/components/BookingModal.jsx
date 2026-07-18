import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Icon } from "./Icon.jsx";
import { formatPrice, formatRuntime, cls } from "../lib/utils.js";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = 10;
const AISLE_AFTER = 5;
const PREMIUM_ROWS = ["A", "B"];
const PREMIUM_PRICE = 18.0;

const SHOWTIMES = ["13:00", "16:15", "19:30", "22:00"];
const DATES = [...Array(5)].map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

function buildSeatLayout() {
  return ROWS.map((row) =>
    [...Array(COLS)].map((_, i) => {
      const taken = (row.charCodeAt(0) + i) % 7 === 0;
      return { id: `${row}${i + 1}`, taken };
    })
  );
}

export default function BookingModal({ movie, onClose, onBooked }) {
  const { isAuthed } = useAuth();
  const [step, setStep] = useState(1); // 1: showtime, 2: seats, 3: checkout, 4: done
  const [layout] = useState(buildSeatLayout);
  const [selected, setSelected] = useState([]);
  const [dateIdx, setDateIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const seatPrice = (id) => (PREMIUM_ROWS.includes(id[0]) ? PREMIUM_PRICE : Number(movie.ticket_price));
  const total = useMemo(
    () => selected.reduce((sum, id) => sum + seatPrice(id), 0),
    [selected] // eslint-disable-line react-hooks/exhaustive-deps
  );

  function toggleSeat(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length >= 8 ? prev : [...prev, id]
    );
  }

  async function handleCheckout() {
    if (!isAuthed) return;
    setError(null);
    setSubmitting(true);
    const showDate = DATES[dateIdx].toISOString().slice(0, 10);
    const unitPrice = Number(movie.ticket_price);
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        movie_id: movie.id,
        movie_title: movie.title,
        poster_url: movie.poster_url,
        show_date: showDate,
        show_time: SHOWTIMES[timeIdx],
        seats: selected,
        num_seats: selected.length,
        unit_price: unitPrice,
        total_price: total,
        status: "confirmed",
      })
      .select()
      .single();
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setConfirmation(data);
    setStep(4);
    onBooked?.(data);
  }

  const showDateLabel = DATES[dateIdx].toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-[pop_0.2s_ease-out]" onClick={onClose} />

      <div className="relative w-full max-w-2xl animate-slideUp rounded-t-3xl sm:rounded-3xl border border-white/10 bg-ink-800 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-ink-800/95 px-5 py-4 backdrop-blur-xl">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-white truncate">{movie.title}</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {movie.genre} • {formatRuntime(movie.runtime_min)} • {formatPrice(movie.ticket_price)} / seat
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-5 pt-4">
          <Stepper step={step} />
        </div>

        <div className="px-5 py-5">
          {/* Step 1: Showtime */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="label">Select date</p>
                <div className="grid grid-cols-5 gap-2">
                  {DATES.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setDateIdx(i)}
                      className={cls(
                        "rounded-xl border px-2 py-2.5 text-center transition",
                        dateIdx === i
                          ? "border-wave-400/60 bg-wave-400/10 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                      )}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">
                        {d.toLocaleDateString(undefined, { weekday: "short" })}
                      </div>
                      <div className="text-sm font-bold">{d.getDate()}</div>
                      <div className="text-[10px] text-slate-500">
                        {d.toLocaleDateString(undefined, { month: "short" })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="label">Select showtime</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SHOWTIMES.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setTimeIdx(i)}
                      className={cls(
                        "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                        timeIdx === i
                          ? "border-gold-400/60 bg-gold-400/10 text-gold-400"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full">
                Choose seats
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Seats */}
          {step === 2 && (
            <div className="space-y-5">
              <Legend />
              <Screen />

              <div className="overflow-x-auto pb-2">
                <div className="mx-auto w-fit space-y-1.5">
                  {layout.map((row, ri) => (
                    <div key={ROWS[ri]} className="flex items-center gap-1.5">
                      <span className="w-5 text-center text-[10px] font-semibold text-slate-500">{ROWS[ri]}</span>
                      {row.map((seat, ci) => {
                        const aisle = ci === AISLE_AFTER;
                        const isSel = selected.includes(seat.id);
                        const isPremium = PREMIUM_ROWS.includes(ROWS[ri]);
                        return (
                          <div key={seat.id} className="flex items-center">
                            {aisle && <span className="w-2" />}
                            <button
                              disabled={seat.taken}
                              onClick={() => toggleSeat(seat.id)}
                              className={cls(
                                "h-7 w-7 rounded-md text-[10px] font-bold transition-all",
                                seat.taken
                                  ? "cursor-not-allowed bg-white/5 text-slate-700 line-through"
                                  : isSel
                                  ? "bg-gradient-to-br from-wave-400 to-wave-600 text-ink-950 scale-105 shadow-[0_4px_14px_-4px_rgba(52,203,199,0.7)]"
                                  : isPremium
                                  ? "bg-gold-500/15 text-gold-400 hover:bg-gold-500/30"
                                  : "bg-white/8 text-slate-300 hover:bg-white/15 hover:text-white"
                              )}
                              aria-label={`Seat ${seat.id}`}
                            >
                              {seat.id.replace(ROWS[ri], "")}
                            </button>
                          </div>
                        );
                      })}
                      <span className="ml-1 w-5 text-center text-[10px] font-semibold text-slate-500">{ROWS[ri]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <SummaryBar
                count={selected.length}
                total={total}
                disabled={selected.length === 0}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                nextLabel="Continue"
              />
            </div>
          )}

          {/* Step 3: Checkout */}
          {step === 3 && (
            <div className="space-y-5">
              {!isAuthed ? (
                <div className="rounded-2xl border border-gold-400/30 bg-gold-400/10 p-5 text-center">
                  <Icon name="user" className="mx-auto h-8 w-8 text-gold-400" />
                  <h3 className="mt-3 font-display text-lg font-bold text-white">Sign in to complete booking</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    You need an account to save your tickets and view them in My Bookings.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link to="/login" className="btn-primary flex-1">Sign in</Link>
                    <Link to="/signup" className="btn-ghost flex-1">Sign up</Link>
                  </div>
                </div>
              ) : (
                <>
                  <CheckoutSummary
                    movie={movie}
                    selected={selected}
                    total={total}
                    showDateLabel={showDateLabel}
                    showTime={SHOWTIMES[timeIdx]}
                    seatPrice={seatPrice}
                  />

                  {error && (
                    <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                      {error}
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/10 bg-ink-700/40 p-4">
                    <p className="label">Payment method</p>
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <Icon name="ticket" className="h-5 w-5 text-wave-300" />
                      <span className="text-sm font-medium text-slate-200">Pay at cinema • Demo checkout</span>
                      <span className="ml-auto chip border border-wave-400/30 bg-wave-400/10 text-wave-200">No charge</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      This is a demo booking flow. No real payment is processed.
                    </p>
                  </div>

                  <SummaryBar
                    count={selected.length}
                    total={total}
                    disabled={submitting}
                    loading={submitting}
                    onBack={() => setStep(2)}
                    onNext={handleCheckout}
                    nextLabel={submitting ? "Confirming..." : "Confirm booking"}
                  />
                </>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && confirmation && (
            <Confirmation
              confirmation={confirmation}
              movie={movie}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const labels = ["Showtime", "Seats", "Checkout", "Done"];
  return (
    <div className="flex items-center gap-1.5">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex flex-1 items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className={cls(
                  "grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold transition",
                  done
                    ? "bg-wave-500 text-ink-950"
                    : active
                    ? "bg-gradient-to-br from-wave-400 to-wave-600 text-ink-950"
                    : "bg-white/8 text-slate-500"
                )}
              >
                {done ? <Icon name="check" className="h-3.5 w-3.5" /> : n}
              </span>
              <span className={cls("text-xs font-medium hidden sm:block", active ? "text-white" : "text-slate-500")}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <span className={cls("h-px flex-1", done ? "bg-wave-500/50" : "bg-white/10")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Legend() {
  const items = [
    { cls: "bg-white/8", label: "Available" },
    { cls: "bg-gradient-to-br from-wave-400 to-wave-600", label: "Selected" },
    { cls: "bg-white/5 line-through opacity-60", label: "Taken" },
    { cls: "bg-gold-500/15", label: "Premium" },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          <span className={cls("h-3.5 w-3.5 rounded", it.cls)} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function Screen() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="relative h-2 rounded-full bg-gradient-to-r from-transparent via-wave-400/60 to-transparent" />
      <div className="mx-auto mt-1 h-6 w-3/4 rounded-b-[100%] bg-wave-400/10 blur-md" />
      <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">Screen</p>
    </div>
  );
}

function SummaryBar({ count, total, disabled, loading, onBack, onNext, nextLabel }) {
  return (
    <div className="sticky bottom-0 -mx-5 -mb-5 border-t border-white/10 bg-ink-800/95 px-5 py-3.5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">
            {count > 0 ? `${count} seat${count > 1 ? "s" : ""} selected` : "No seats selected"}
          </p>
          <p className="font-display text-xl font-bold text-white">{formatPrice(total)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="btn-ghost">
            <Icon name="chevron-left" className="h-4 w-4" />
            Back
          </button>
          <button onClick={onNext} disabled={disabled} className="btn-primary">
            {nextLabel}
            {!loading && <Icon name="arrow-right" className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutSummary({ movie, selected, total, showDateLabel, showTime, seatPrice }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-700/40 p-4">
      <div className="flex gap-3">
        <img src={movie.poster_url} alt={movie.title} className="h-24 w-16 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-white">{movie.title}</h3>
          <p className="mt-0.5 text-xs text-slate-400">{movie.genre} • {formatRuntime(movie.runtime_min)}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1">
              <Icon name="calendar" className="h-3 w-3 text-wave-300" /> {showDateLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1">
              <Icon name="clock" className="h-3 w-3 text-wave-300" /> {showTime}
            </span>
          </div>
        </div>
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="space-y-1.5 text-sm">
        {selected.map((id) => (
          <div key={id} className="flex justify-between text-slate-300">
            <span>Seat {id} {PREMIUM_ROWS.includes(id[0]) && <span className="text-gold-400 text-xs">(Premium)</span>}</span>
            <span>{formatPrice(seatPrice(id))}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between border-t border-white/10 pt-3">
        <span className="font-semibold text-white">Total</span>
        <span className="font-display text-lg font-bold text-gold-400">{formatPrice(total)}</span>
      </div>
    </div>
  );
}

function Confirmation({ confirmation, movie, onClose }) {
  return (
    <div className="text-center py-4">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-wave-400 to-wave-600 animate-pop">
        <Icon name="check" className="h-8 w-8 text-ink-950" strokeWidth={2.5} />
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-white">Booking confirmed!</h3>
      <p className="mt-1 text-sm text-slate-400">
        Your tickets for <span className="text-white">{movie.title}</span> are booked.
      </p>

      <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-white/10 bg-ink-700/40 p-4 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Booking ID</span>
          <span className="font-mono text-xs text-wave-300">{confirmation.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">Seats</span>
          <span className="font-semibold text-white">{confirmation.seats.join(", ")}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">Date & time</span>
          <span className="font-semibold text-white">
            {new Date(confirmation.show_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} • {confirmation.show_time}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">Total paid</span>
          <span className="font-display font-bold text-gold-400">{formatPrice(confirmation.total_price)}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Link to="/bookings" className="btn-primary flex-1">View My Bookings</Link>
        <button onClick={onClose} className="btn-ghost flex-1">Done</button>
      </div>
    </div>
  );
}
