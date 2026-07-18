import { Link } from "react-router-dom";
import { Icon } from "../components/Icon.jsx";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="container-x py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <Icon name="chevron-left" className="h-4 w-4" />
          Back to home
        </Link>

        <div className="card rounded-3xl p-7 sm:p-8">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-wave-400/20 to-wave-600/10 ring-1 ring-wave-400/30">
              <Icon name="wave" className="h-5 w-5 text-wave-300" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Cine<span className="text-gradient">Wave</span>
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  );
}
