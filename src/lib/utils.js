export function formatRuntime(min) {
  if (!min && min !== 0) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatPrice(n) {
  const num = Number(n) || 0;
  return `$${num.toFixed(2)}`;
}

export function ratingTone(r) {
  const v = Number(r) || 0;
  if (v >= 8) return "text-wave-300";
  if (v >= 7) return "text-gold-400";
  return "text-rose-300";
}

export function initials(email) {
  if (!email) return "?";
  const base = email.split("@")[0];
  return base.slice(0, 2).toUpperCase();
}

export function formatDateLong(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function cls(...parts) {
  return parts.filter(Boolean).join(" ");
}
