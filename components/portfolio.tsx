export function Portfolio() {
  return (
    <section className="py-8 md:py-12">
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-center mb-8 md:mb-12">
        Portfolio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
          >
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
              <span className="text-sm">Portfolio Item {item}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
