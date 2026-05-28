import { Link } from 'react-router-dom'

export default function Logo({ size = 'md', white = false }) {
  const sizes = {
    sm: { container: 'h-8', text: 'text-lg', sub: 'text-[9px]' },
    md: { container: 'h-10', text: 'text-2xl', sub: 'text-[10px]' },
    lg: { container: 'h-14', text: 'text-4xl', sub: 'text-xs' },
    xl: { container: 'h-20', text: 'text-6xl', sub: 'text-sm' },
  }
  const s = sizes[size] || sizes.md

  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label="Senbitik - Accueil">
      {/* Emblem */}
      <div className={`relative flex-shrink-0 ${s.container} aspect-square`}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="24" cy="24" r="23" fill={white ? 'rgba(255,255,255,0.15)' : '#C4603B'} stroke={white ? 'rgba(255,255,255,0.4)' : '#B54D2A'} strokeWidth="1.5"/>
          {/* Stylized N */}
          <path d="M14 34V14L24 30V14M24 30V34H34V14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Decorative dot */}
          <circle cx="24" cy="7" r="2" fill={white ? 'rgba(255,255,255,0.6)' : '#D4AF37'}/>
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif font-bold tracking-wide ${s.text} ${
            white ? 'text-white' : 'text-primary-600 dark:text-primary-400'
          } group-hover:opacity-80 transition-opacity`}
        >
          Senbitik
        </span>
        <span
          className={`font-sans font-medium tracking-widest uppercase ${s.sub} ${
            white ? 'text-white/60' : 'text-earth-400 dark:text-earth-500'
          }`}
        >
          Le terroir à portée de clic
        </span>
      </div>
    </Link>
  )
}
