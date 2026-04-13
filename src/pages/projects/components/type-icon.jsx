import { getTypeConfig, HugeiconsIcon } from "@/data/type-icons"

export function TypeIcon({ type, size = 16, className }) {
  const config = getTypeConfig(type)
  return (
    <span className={`shrink-0 inline-flex ${className ?? ""}`}>
      <HugeiconsIcon
        icon={config.icon}
        style={{ width: size, height: size, color: config.color }}
      />
    </span>
  )
}
