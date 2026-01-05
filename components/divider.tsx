export function Divider() {
  return (
    <div className="flex items-center justify-center py-12 md:py-16">
      <div className="flex items-center gap-4">
        <div className="w-24 md:w-32 h-px bg-gray-300 dark:bg-gray-700" />
        <div className="w-2.5 h-2.5 border border-gray-300 dark:border-gray-700 rotate-45" />
        <div className="w-24 md:w-32 h-px bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  )
}
