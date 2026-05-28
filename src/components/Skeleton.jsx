export function ProductCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="skeleton h-56 sm:h-64 rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-24 rounded" />
        <div className="flex justify-between items-center mt-2">
          <div className="skeleton h-6 w-28 rounded" />
          <div className="skeleton h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
      <div className="space-y-4">
        <div className="skeleton h-96 rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
      <div className="space-y-4">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-10 w-4/5 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-8 w-40 rounded" />
        <div className="skeleton h-24 rounded-xl" />
        <div className="skeleton h-12 rounded-xl" />
      </div>
    </div>
  )
}

export function ProducerCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="skeleton h-40 rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="skeleton w-12 h-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        </div>
        <div className="skeleton h-16 rounded" />
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="skeleton h-40 rounded-2xl" />
  )
}
