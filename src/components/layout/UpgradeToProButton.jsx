import { SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function UpgradeToProButton({ className, ...props }) {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start gap-2 text-sm",
        className
      )}
      {...props}
    >
      <SparklesIcon className="size-4" />
      Upgrade to Pro
    </Button>
  )
}

export default UpgradeToProButton
