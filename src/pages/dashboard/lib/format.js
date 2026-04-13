// Shared formatters for dashboard

export function formatCurrency(value, opts = {}) {
  const n = Number(value || 0)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...opts,
  }).format(n)
}

// "Compact" — $1.4M, $12.3K
export function formatCurrencyCompact(value) {
  const n = Number(value || 0)
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

export function formatNumber(value, loc) {
  return new Intl.NumberFormat(loc || "en-US").format(Number(value || 0))
}

export function formatNumberCompact(value) {
  const n = Number(value || 0)
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

export function formatPercent(value, fractionDigits = 0) {
  const n = Number(value || 0)
  return `${n >= 0 ? "+" : ""}${n.toFixed(fractionDigits)}%`
}

export function formatHours(value) {
  const n = Number(value || 0)
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k h`
  return `${Math.round(n)}h`
}
