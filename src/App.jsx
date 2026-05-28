import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'

// Lazy-load pages for optimal code splitting
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const Orders = lazy(() => import('./pages/Orders'))
const Producers = lazy(() => import('./pages/Producers'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-earth-400 font-medium animate-pulse">Senbitik</p>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  // Scroll to top on route change
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
  }
  return null
}

// Redirige l'admin vers /admin sauf s'il est en mode prévisualisation
function CustomerRoute({ children }) {
  const { user } = useAuth()
  if (user?.role === 'admin' && !sessionStorage.getItem('senbitik-admin-preview')) {
    return <Navigate to="/admin" replace />
  }
  return children
}

// Barre flottante "Retour admin" visible quand l'admin prévisualise la boutique
function AdminPreviewBar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isPreview = user?.role === 'admin' && sessionStorage.getItem('senbitik-admin-preview')
  if (!isPreview) return null

  const handleBack = () => {
    sessionStorage.removeItem('senbitik-admin-preview')
    navigate('/admin')
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-2xl hover:bg-slate-800 transition-all border border-slate-700"
      >
        ← Retour au dashboard admin
      </button>
    </div>
  )
}

const AUTH_ROUTES = ['/connexion', '/inscription', '/mot-de-passe-oublie']
const ADMIN_ROUTES = ['/admin']

function AppLayout() {
  const { pathname } = useLocation()
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 dark:bg-earth-950 transition-colors duration-300">
      <ScrollToTop />
      {!isAuthRoute && !isAdminRoute && <Navbar />}
      {!isAuthRoute && !isAdminRoute && <AdminPreviewBar />}
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<CustomerRoute><Home /></CustomerRoute>} />
            <Route path="/boutique" element={<CustomerRoute><Shop /></CustomerRoute>} />
            <Route path="/produit/:slug" element={<CustomerRoute><ProductDetail /></CustomerRoute>} />
            <Route path="/panier" element={<CustomerRoute><Cart /></CustomerRoute>} />
            <Route path="/commande" element={<CustomerRoute><Checkout /></CustomerRoute>} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/profil" element={<CustomerRoute><Profile /></CustomerRoute>} />
            <Route path="/commandes" element={<CustomerRoute><Orders /></CustomerRoute>} />
            <Route path="/favoris" element={<CustomerRoute><Profile /></CustomerRoute>} />
            <Route path="/producteurs" element={<CustomerRoute><Producers /></CustomerRoute>} />
            <Route path="/producteurs/:slug" element={<CustomerRoute><Producers /></CustomerRoute>} />
            <Route path="/a-propos" element={<CustomerRoute><About /></CustomerRoute>} />
            <Route path="/contact" element={<CustomerRoute><Contact /></CustomerRoute>} />
            <Route path="/faq" element={<CustomerRoute><FAQ /></CustomerRoute>} />
            <Route path="/cgv" element={<CustomerRoute><FAQ /></CustomerRoute>} />
            <Route path="/mentions-legales" element={<CustomerRoute><FAQ /></CustomerRoute>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      {!isAuthRoute && !isAdminRoute && <Footer />}
      {!isAuthRoute && !isAdminRoute && <CartDrawer />}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
