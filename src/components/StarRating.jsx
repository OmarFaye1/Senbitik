import { Star } from 'lucide-react'

export default function StarRating({ rating, maxStars = 5, size = 'sm', showValue = false, count = null, hideCount = false }) {
  const sizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  const iconSize = sizes[size] || sizes.sm

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating)
          const partial = !filled && i < rating
          return (
            <span key={i} className="relative inline-block">
              <Star className={`${iconSize} text-sand-300 dark:text-earth-700`} />
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: partial ? `${(rating % 1) * 100}%` : '100%' }}
                >
                  <Star className={`${iconSize} text-accent-500 fill-accent-500`} />
                </span>
              )}
            </span>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-earth-700 dark:text-sand-300">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className={`text-xs text-earth-400 dark:text-earth-500 ${hideCount ? 'hidden sm:inline' : ''}`}>
          ({count})
        </span>
      )}
    </div>
  )
}
