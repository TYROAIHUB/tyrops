// Unified tech data — AI Platforms + Stack + Database in one grouped structure
// Used by TechMultiSelect and icon lookup

import { TECH_STACK_GROUPS } from "./tech-stacks"

// AI Platforms group
const AI_PLATFORM_GROUP = {
  group: "AI Platform",
  items: [
    { value: "Claude",          label: "Claude",          desc: "Anthropic",  icon: "simple-icons:anthropic",     bg: "#D97757", color: "#fff" },
    { value: "ChatGPT",         label: "ChatGPT",         desc: "OpenAI",     icon: "simple-icons:openai",        bg: "#000000", color: "#fff" },
    { value: "Gemini",          label: "Gemini",          desc: "Google",     icon: "simple-icons:googlegemini",  bg: "#8E75B2", color: "#fff" },
    { value: "Copilot Studio",  label: "Copilot Studio",  desc: "Microsoft",  imgUrl: "https://img.icons8.com/?size=100&id=PxQoyT1s0uFh&format=png&color=000000", bg: "#fff" },
  ],
}

// Microsoft Power Platform group
const POWER_PLATFORM_GROUP = {
  group: "Microsoft Power Platform",
  items: [
    { value: "Power Automate", label: "Power Automate", icon: "simple-icons:powerautomate", bg: "#0066FF", color: "#fff" },
    { value: "Power Apps",     label: "Power Apps",     icon: "simple-icons:powerapps",     bg: "#742774", color: "#fff" },
    { value: "Power BI",       label: "Power BI",       icon: "simple-icons:powerbi",       bg: "#F2C811", color: "#000" },
    { value: "Power Pages",    label: "Power Pages",    icon: "simple-icons:powerpages",    bg: "#0078D4", color: "#fff" },
    { value: "D365 FO",        label: "D365 F&O",       desc: "Finance & Operations", icon: "simple-icons:dynamics365", bg: "#002050", color: "#fff" },
  ],
}

// Database group (no "None" — optional by not selecting)
const DATABASE_GROUP = {
  group: "Database",
  items: [
    { value: "Supabase",    label: "Supabase",    icon: "logos:supabase-icon",          bg: "#1C1C1C" },
    { value: "Dataverse",   label: "Dataverse",   icon: "__dataverse__",                bg: "#008575", color: "#fff" },
    { value: "SQL Server",  label: "SQL Server",  icon: "simple-icons:microsoftsqlserver", bg: "#CC2927", color: "#fff" },
    { value: "Excel",       label: "Excel",       icon: "vscode-icons:file-type-excel", bg: "#217346" },
  ],
}

// Merge: AI Platform first, then all stack groups, Database last
export const TECH_ALL_GROUPS = [
  AI_PLATFORM_GROUP,
  POWER_PLATFORM_GROUP,
  ...TECH_STACK_GROUPS.filter((g) => g.group !== "Database"), // exclude duplicate DB group from stacks
  DATABASE_GROUP,
]

// Flat array for fast lookup
export const TECH_ALL_ITEMS = TECH_ALL_GROUPS.flatMap((g) => g.items)

export function getTechItem(value) {
  return (
    TECH_ALL_ITEMS.find((t) => t.value === value) ?? {
      value,
      label: value,
      icon: null,
      bg: "#e5e7eb",
      abbr: value.slice(0, 2).toUpperCase(),
    }
  )
}
