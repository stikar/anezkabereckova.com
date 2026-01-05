export function Portfolio() {
  return (
    <section className="py-4 md:py-8">
      <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-center mb-8 md:mb-12">
        Portfolio
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div
            key={item}
            className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 overflow-hidden hover:opacity-80 transition-opacity"
          >
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
              <span className="text-xs">Item {item}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
