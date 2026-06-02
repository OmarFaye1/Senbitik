export const formatPrice = (amount, currency = 'XOF', locale = 'fr-FR') => {
  if (currency === 'XOF') {
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateString, locale = 'fr-FR') => {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export const formatDateShort = (dateString, locale = 'fr-FR') => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim()

export const truncate = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export const getDiscountPercent = (original, current) => {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const generateOrderId = () => {
  const prefix = 'NAT'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export const getStockStatus = (stock, lang = 'fr') => {
  const labels = {
    fr: {
      out: { label: 'Rupture de stock', color: 'text-red-500' },
      low: { label: `Dernières unités (${stock})`, color: 'text-orange-500' },
      available: { label: 'En stock', color: 'text-green-600' },
    },
    en: {
      out: { label: 'Out of stock', color: 'text-red-500' },
      low: { label: `Low stock (${stock})`, color: 'text-orange-500' },
      available: { label: 'In stock', color: 'text-green-600' },
    },
  }
  const t = labels[lang] || labels.fr
  if (stock === 0) return t.out
  if (stock <= 5) return t.low
  return t.available
}

export const sortProducts = (products, sortBy) => {
  const sorted = [...products]
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    case 'name-asc':
      return sorted.sort((a, b) => a.name.fr.localeCompare(b.name.fr))
    default:
      return sorted
  }
}

export const filterProducts = (products, filters) => {
  return products.filter(product => {
    if (filters.category && filters.category !== 'all' && product.category !== filters.category) return false
    if (filters.minPrice && product.price < filters.minPrice) return false
    if (filters.maxPrice && product.price > filters.maxPrice) return false
    if (filters.rating && product.rating < filters.rating) return false
    if (filters.search) {
      const query = filters.search.toLowerCase()
      const name = (product.name.fr + ' ' + product.name.en).toLowerCase()
      const tags = product.tags.join(' ').toLowerCase()
      if (!name.includes(query) && !tags.includes(query)) return false
    }
    return true
  })
}
