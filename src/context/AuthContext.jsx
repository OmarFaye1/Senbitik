import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'senbitik-user'

const DEMO_USERS = [
  {
    id: 1,
    email: 'demo@senbitik.com',
    password: 'demo1234',
    firstName: 'Amadou',
    lastName: 'Sarr',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    role: 'customer',
    createdAt: '2023-09-01',
    phone: '+221 77 000 00 00',
    address: { city: 'Dakar', quartier: 'Almadies' },
  },
  {
    id: 99,
    email: 'admin@senbitik.com',
    password: 'admin1234',
    firstName: 'Admin',
    lastName: 'Senbitik',
    avatar: 'https://ui-avatars.com/api/?name=Admin+Senbitik&background=C4603B&color=fff&size=100',
    role: 'admin',
    createdAt: '2023-01-01',
    phone: '+221 76 396 16 32',
    address: { city: 'Dakar', quartier: 'Plateau' },
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const found = DEMO_USERS.find(
      u => u.email === email && u.password === password
    )
    setLoading(false)
    if (!found) throw new Error('Email ou mot de passe incorrect')
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    return safeUser
  }, [])

  const register = useCallback(async ({ email, password, firstName, lastName }) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const exists = DEMO_USERS.some(u => u.email === email)
    if (exists) {
      setLoading(false)
      throw new Error('Un compte existe déjà avec cet email')
    }
    const newUser = {
      id: Date.now(),
      email,
      firstName,
      lastName,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=C4603B&color=fff&size=100`,
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0],
    }
    DEMO_USERS.push({ ...newUser, password })
    setLoading(false)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateProfile = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
