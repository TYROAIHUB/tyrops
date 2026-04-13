// Pure compute helpers — no React, no side-effects

export function computePortfolioKpis(projects = [], settings = {}) {
  const hourlyRate = Number(settings?.hourlyRate || 0)

  const totals = projects.reduce(
    (acc, p) => {
      acc.totalValue += Number(p.valueGenerated || 0)
      acc.totalCost += Number(p.costSpent || 0)
      acc.totalMonthly += Number(p.monthlyRecurring || 0)
      acc.totalReplaced += Number(p.replacedCost || 0)
      acc.totalSavedTime += Number(p.savedTime || 0)
      acc.activeUsers += Number(p.activeUsers || 0)
      acc.totalInteractions += Number(p.totalInteractions || 0)
      acc.totalRuntime += Number(p.totalRuntime || 0)
      return acc
    },
    {
      totalValue: 0,
      totalCost: 0,
      totalMonthly: 0,
      totalReplaced: 0,
      totalSavedTime: 0,
      activeUsers: 0,
      totalInteractions: 0,
      totalRuntime: 0,
    }
  )

  // Annual net benefit = value generated + replaced cost - 12 months ongoing
  const annualNetBenefit =
    totals.totalValue + totals.totalReplaced - totals.totalMonthly * 12
  // Monthly net benefit
  const monthlyNet =
    (totals.totalValue + totals.totalReplaced) / 12 - totals.totalMonthly
  // ROI %
  const roi = totals.totalCost > 0 ? (annualNetBenefit / totals.totalCost) * 100 : null
  // Payback in months
  const payback =
    totals.totalCost > 0 && monthlyNet > 0 ? totals.totalCost / monthlyNet : null
  // Time value monetized (using hourlyRate)
  const savedTimeValue = hourlyRate > 0 ? totals.totalSavedTime * hourlyRate : 0

  return {
    ...totals,
    annualNetBenefit,
    monthlyNet,
    roi,
    payback,
    savedTimeValue,
    hourlyRate,
  }
}

export function groupByStatus(projects = []) {
  return projects.reduce(
    (acc, p) => {
      const s = p.status || "planned"
      acc[s] = (acc[s] || 0) + 1
      return acc
    },
    { active: 0, completed: 0, planned: 0, hold: 0 }
  )
}

export function groupByType(projects = []) {
  const map = new Map()
  for (const p of projects) {
    const t = p.type || "other"
    const cur = map.get(t) || { type: t, count: 0, valueGenerated: 0 }
    cur.count += 1
    cur.valueGenerated += Number(p.valueGenerated || 0)
    map.set(t, cur)
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

export function topProjectsByValue(projects = [], n = 5) {
  return [...projects]
    .filter((p) => Number(p.valueGenerated || 0) > 0)
    .sort((a, b) => Number(b.valueGenerated || 0) - Number(a.valueGenerated || 0))
    .slice(0, n)
}

export function teamContribution(projects = []) {
  const map = new Map()
  for (const p of projects) {
    const value = Number(p.valueGenerated || 0)
    const team = Array.isArray(p.team) ? p.team : []
    if (team.length === 0) continue
    // Distribute value equally among team members
    const share = value / team.length
    for (const name of team) {
      const cur = map.get(name) || {
        name,
        value: 0,
        count: 0,
        active: 0,
        completed: 0,
      }
      cur.value += share
      cur.count += 1
      if (p.status === "active") cur.active += 1
      if (p.status === "completed") cur.completed += 1
      map.set(name, cur)
    }
  }
  return Array.from(map.values()).sort((a, b) => b.value - a.value)
}

// Annual forecast — projection for next 12 months
export function computeAnnualForecast(projects = [], settings = {}) {
  const k = computePortfolioKpis(projects, settings)
  const annualSavedTime = k.totalSavedTime * 12
  const annualSavedValue = annualSavedTime * (k.hourlyRate || 0)
  const annualOngoingCost = k.totalMonthly * 12
  // Annual recurring value = (totalValue / project lifetime) — but we don't know lifetimes.
  // Conservative approximation: assume current totalValue continues annually.
  const annualValueProjection = k.totalValue
  const annualReplacedSavings = k.totalReplaced
  const annualNetBenefit =
    annualValueProjection + annualReplacedSavings + annualSavedValue - annualOngoingCost
  return {
    annualSavedTime,
    annualSavedValue,
    annualOngoingCost,
    annualValueProjection,
    annualReplacedSavings,
    annualNetBenefit,
  }
}

// Per-type performance breakdown (count, users, value, savedTime, costSpent)
export function performanceByType(projects = []) {
  const map = new Map()
  for (const p of projects) {
    const type = p.type || "other"
    const cur = map.get(type) || {
      type,
      count: 0,
      activeUsers: 0,
      totalInteractions: 0,
      valueGenerated: 0,
      replacedCost: 0,
      savedTime: 0,
      costSpent: 0,
      monthlyRecurring: 0,
    }
    cur.count += 1
    cur.activeUsers += Number(p.activeUsers || 0)
    cur.totalInteractions += Number(p.totalInteractions || 0)
    cur.valueGenerated += Number(p.valueGenerated || 0)
    cur.replacedCost += Number(p.replacedCost || 0)
    cur.savedTime += Number(p.savedTime || 0)
    cur.costSpent += Number(p.costSpent || 0)
    cur.monthlyRecurring += Number(p.monthlyRecurring || 0)
    map.set(type, cur)
  }
  return Array.from(map.values())
    .filter((g) => g.valueGenerated > 0 || g.activeUsers > 0 || g.savedTime > 0)
    .sort((a, b) => b.valueGenerated - a.valueGenerated)
}

// Top projects by ROI (single-project ROI)
export function topProjectsByRoi(projects = [], n = 5) {
  return projects
    .map((p) => {
      const cost = Number(p.costSpent || 0)
      const value = Number(p.valueGenerated || 0)
      const replaced = Number(p.replacedCost || 0)
      const monthly = Number(p.monthlyRecurring || 0)
      const annualNet = value + replaced - monthly * 12
      const roi = cost > 0 ? (annualNet / cost) * 100 : null
      return { ...p, _roi: roi, _annualNet: annualNet }
    })
    .filter((p) => p._roi !== null)
    .sort((a, b) => b._roi - a._roi)
    .slice(0, n)
}

export function countActive(items = [], statusKey = "status", activeValue = "active") {
  return items.filter((x) => x?.[statusKey] === activeValue || x?.[statusKey] === "running").length
}

// Top automations by monthly time saved
export function topAutomationsBySaved(automations = [], n = 5) {
  return [...automations]
    .filter((a) => Number(a.monthlyTimeSaved || 0) > 0)
    .sort((a, b) => Number(b.monthlyTimeSaved || 0) - Number(a.monthlyTimeSaved || 0))
    .slice(0, n)
}

// Top tech across projects by usage count + total value share
export function topTechStack(projects = [], n = 8) {
  const map = new Map()
  for (const p of projects) {
    const techs = Array.isArray(p.tech) ? p.tech : Array.isArray(p.stack) ? p.stack : []
    if (techs.length === 0) continue
    const value = Number(p.valueGenerated || 0)
    const valueShare = value / Math.max(techs.length, 1)
    for (const tech of techs) {
      const cur = map.get(tech) || { name: tech, count: 0, value: 0 }
      cur.count += 1
      cur.value += valueShare
      map.set(tech, cur)
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count || b.value - a.value)
    .slice(0, n)
}

// Recent activity across projects + agents + automations sorted by createdAt desc
export function recentActivity(projects = [], agents = [], automations = [], n = 6) {
  const items = [
    ...projects.map((p) => ({ ...p, kind: "project" })),
    ...agents.map((a) => ({ ...a, kind: "agent" })),
    ...automations.map((a) => ({ ...a, kind: "automation" })),
  ]
  return items
    .filter((x) => x.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, n)
}
