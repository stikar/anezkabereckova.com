export function Divider() {
  return (
    <div className="flex items-center justify-center py-12 md:py-16">
      <div className="flex items-center gap-4">
        <div className="w-16 md:w-24 h-px bg-current" />
        <div className="w-3 h-3 border border-current rotate-45" />
        <div className="w-16 md:w-24 h-px bg-current" />
      </div>
    </div>
  )
}
