import { Link } from "react-router-dom";
import { Icon } from "./Icon.jsx";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-ink-950/60">
      <div className="container-x py-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-wave-400/20 to-wave-600/10 ring-1 ring-wave-400/30">
              <Icon name="wave" className="h-5 w-5 text-wave-300" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-white">
                Cine<span className="text-gradient">Wave</span>
              </p>
              <p className="text-xs text-slate-500">Movie tickets, reimagined.</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <Link to="/" className="transition hover:text-white">Now Showing</Link>
            <Link to="/bookings" className="transition hover:text-white">My Bookings</Link>
            <span className="text-slate-600">© {new Date().getFullYear()} CineWave</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
