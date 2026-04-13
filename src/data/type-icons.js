import { HugeiconsIcon } from "@hugeicons/react"
import WebDesign01Icon from "@hugeicons/core-free-icons/WebDesign01Icon"
import SmartPhone01Icon from "@hugeicons/core-free-icons/SmartPhone01Icon"
import ApiIcon from "@hugeicons/core-free-icons/ApiIcon"
import FlowConnectionIcon from "@hugeicons/core-free-icons/FlowConnectionIcon"
import AiBrain01Icon from "@hugeicons/core-free-icons/AiBrain01Icon"
import CableIcon from "@hugeicons/core-free-icons/CableIcon"
import PipelineIcon from "@hugeicons/core-free-icons/PipelineIcon"
import PuzzleIcon from "@hugeicons/core-free-icons/PuzzleIcon"
import Analytics02Icon from "@hugeicons/core-free-icons/Analytics02Icon"
import Layers01Icon from "@hugeicons/core-free-icons/Layers01Icon"
import GridIcon from "@hugeicons/core-free-icons/GridIcon"

export const TYPE_ICONS = {
  "web-app":       { icon: WebDesign01Icon,   color: "#0ea5e9", label: "Web App" },
  "mobile-app":    { icon: SmartPhone01Icon,  color: "#8b5cf6", label: "Mobile App" },
  "api":           { icon: ApiIcon,           color: "#14b8a6", label: "API" },
  "automation":    { icon: FlowConnectionIcon, color: "#f59e0b", label: "Automation" },
  "agent":         { icon: AiBrain01Icon,     color: "#0d9488", label: "Agent" },
  "mcp":           { icon: CableIcon,         color: "#6366f1", label: "MCP" },
  "data-pipeline": { icon: PipelineIcon,      color: "#f97316", label: "Data Pipeline" },
  "integration":   { icon: PuzzleIcon,        color: "#06b6d4", label: "Integration" },
  "analytics":     { icon: Analytics02Icon,   color: "#f43f5e", label: "Analytics" },
  "platform":      { icon: Layers01Icon,      color: "#d946ef", label: "Platform" },
  "other":         { icon: GridIcon,          color: "#6b7280", label: "Other" },
}

export function getTypeConfig(type) {
  return TYPE_ICONS[type] || TYPE_ICONS["other"]
}

export { HugeiconsIcon }
