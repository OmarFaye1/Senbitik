import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'senbitik-wishlist'

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  const isInWishlist = useCallback(
    (productId) => wishlist.some(id => id === productId),
    [wishlist]
  )

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const clearWishlist = useCallback(() => setWishlist([]), [])

  return { wishlist, isInWishlist, toggleWishlist, clearWishlist }
}
