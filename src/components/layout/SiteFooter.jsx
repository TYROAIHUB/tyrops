export function SiteFooter() {
  return (
    <footer className="border-t bg-background px-4 py-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} TYROPS. All rights reserved.</span>
        <span>AI Ops Tracker</span>
      </div>
    </footer>
  )
}

export default SiteFooter
