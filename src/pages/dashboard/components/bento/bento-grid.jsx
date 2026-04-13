import { cn } from "@/lib/utils"

export function BentoGrid({ children, className }) {
  return (
    <div className={cn("grid grid-cols-12 gap-4 auto-rows-[minmax(140px,auto)]", className)}>
      {children}
    </div>
  )
}
