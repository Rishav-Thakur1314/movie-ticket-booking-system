import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Icon } from "./Icon.jsx";
import { initials, cls } from "../lib/utils.js";

export default function Navbar() {
  const { isAuthed, email, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navItemCls = ({ isActive }) =>
    cls(
      "relative px-1 py-1 text-sm font-medium transition-colors",
      isActive ? "text-white" : "text-slate-400 hover:text-white"
    );

  const linkUnderline =
    "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-wave-400 after:transition-transform after:duration-300";
  const activeUnderline = "after:scale-x-100";

  async function handleSignOut() {
    await signOut();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-wave-400/20 to-wave-600/10 ring-1 ring-wave-400/30 transition-transform group-hover:scale-105">
            <Icon name="wave" className="h-5 w-5 text-wave-300" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Cine<span className="text-gradient">Wave</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={(p) => cls(navItemCls(p), linkUnderline, p.isActive && activeUnderline)}>
            Now Showing
          </NavLink>
          <NavLink to="/bookings" className={(p) => cls(navItemCls(p), linkUnderline, p.isActive && activeUnderline)}>
            My Bookings
          </NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition hover:border-white/20 hover:bg-white/10"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-wave-400 to-wave-600 text-xs font-bold text-ink-950">
                  {initials(email)}
                </span>
                <span className="hidden sm:block max-w-[120px] truncate text-xs font-medium text-slate-300">
                  {email}
                </span>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 animate-pop origin-top-right rounded-2xl border border-white/10 bg-ink-800 p-2 shadow-2xl shadow-black/50">
                    <div className="px-3 py-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Signed in</p>
                      <p className="truncate text-sm font-medium text-white">{email}</p>
                    </div>
                    <div className="my-1 h-px bg-white/10" />
                    <Link
                      to="/bookings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <Icon name="ticket" className="h-4 w-4 text-wave-300" />
                      My Bookings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <Icon name="logout" className="h-4 w-4 text-rose-300" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-ink-900/95 px-5 py-4 animate-slideUp">
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cls("rounded-xl px-3 py-2.5 text-sm font-medium", isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5")
              }
            >
              Now Showing
            </NavLink>
            <NavLink
              to="/bookings"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cls("rounded-xl px-3 py-2.5 text-sm font-medium", isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5")
              }
            >
              My Bookings
            </NavLink>
          </nav>
          {!isAuthed && (
            <div className="mt-3 flex gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost flex-1">
                Sign in
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary flex-1">
                Sign up
              </Link>
            </div>
          )}
          {isAuthed && (
            <button onClick={handleSignOut} className="btn-ghost mt-3 w-full">
              <Icon name="logout" className="h-4 w-4" /> Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
