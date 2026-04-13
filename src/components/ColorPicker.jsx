import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ColorPicker({ label, cssVar, value, onChange }) {
  const [localValue, setLocalValue] = React.useState(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleColorChange = (e) => {
    const newColor = e.target.value
    setLocalValue(newColor)
    onChange(cssVar, newColor)
  }

  const handleTextChange = (e) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(cssVar, newValue)
  }

  // Get current computed color for display
  const displayColor = React.useMemo(() => {
    if (localValue && localValue.startsWith('#')) {
      return localValue
    }

    // Try to get computed value from CSS
    const computed = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
    if (computed && computed.startsWith('#')) {
      return computed
    }

    return '#000000'
  }, [localValue, cssVar])

  return (
    <div className="space-y-2">
      <Label htmlFor={`color-${cssVar}`} className="text-xs font-medium">
        {label}
      </Label>
      <div className="flex items-start gap-2">
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-0 overflow-hidden cursor-pointer"
            style={{ backgroundColor: displayColor }}
          >
            <input
              type="color"
              id={`color-${cssVar}`}
              value={displayColor}
              onChange={handleColorChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </Button>
        </div>
        <Input
          type="text"
          placeholder={`${cssVar} value`}
          value={localValue}
          onChange={handleTextChange}
          className="h-8 text-xs flex-1"
        />
      </div>
    </div>
  )
}
