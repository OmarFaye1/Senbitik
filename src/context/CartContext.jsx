import { createContext, useCallback, useContext, useEffect, useReducer } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'senbitik-cart'

const initialState = {
  items: [],
  isOpen: false,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'REFRESH_PRICES': {
      // Met à jour prix et prix grossiste depuis l'API sans toucher aux quantités
      const map = {}
      action.payload.forEach(p => { map[p.id] = p })
      return {
        ...state,
        items: state.items.map(item => {
          const p = map[item.id]
          if (!p) return item
          return {
            ...item,
            price: p.price,
            wholesalePrice: p.wholesalePrice || null,
            stock: p.stock,
          }
        }),
      }
    }
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: Math.min(i.quantity + action.payload.quantity, i.stock) }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.min(action.payload.quantity, i.stock) }
            : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'HYDRATE':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const items = JSON.parse(stored)
        dispatch({ type: 'HYDRATE', payload: items })
        // Refresh les prix depuis l'API au démarrage (capture les nouveaux prix grossistes)
        if (items.length > 0) {
          fetch('/api/products')
            .then(r => r.json())
            .then(products => dispatch({ type: 'REFRESH_PRICES', payload: products }))
            .catch(() => {})
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const addItem = useCallback((product, quantity = 1, lang = 'fr') => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        slug: product.slug,
        name: product.name[lang] || product.name.fr,
        price: product.price,
        wholesalePrice: product.wholesalePrice || null,
        image: product.images[0],
        stock: product.stock,
        producer: product.producer,
        quantity,
      },
    })
  }, [])

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [])
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])

  // Prix effectif : prix grossiste si quantité >= 10 et prix grossiste défini
  const effectivePrice = (item) =>
    (item.quantity >= 10 && item.wholesalePrice) ? item.wholesalePrice : item.price

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0)
  const subtotal = state.items.reduce((acc, i) => acc + effectivePrice(i) * i.quantity, 0)
  const shipping = subtotal > 50000 ? 0 : subtotal > 0 ? 3500 : 0
  const total = subtotal + shipping

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      subtotal,
      shipping,
      total,
      effectivePrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
