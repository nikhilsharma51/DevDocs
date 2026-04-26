import { useTheme } from '../../hooks/useTheme'

export default function ThemeToggleButton({ compact = false }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center justify-center gap-1.5 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors ${
        compact
          ? 'w-9 h-9 rounded-lg'
          : 'px-3 h-9 rounded-lg text-[12px] font-medium'
      }`}
    >
      {isDark ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 1v2.5M12 20.5V23M4.2 4.2l1.8 1.8M18 18l1.8 1.8M1 12h2.5M20.5 12H23M4.2 19.8L6 18M18 6l1.8-1.8" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3c-.04.27-.06.54-.06.82A9 9 0 0021 12.79z" />
        </svg>
      )}
      {!compact && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
    </button>
  )
}
