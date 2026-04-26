// src/components/layout/Topbar.jsx
import { useNavigate } from 'react-router-dom'
import ThemeToggleButton from '../ui/ThemeToggleButton'

export default function Topbar() {
  const navigate = useNavigate()

  return (
    <header className="h-13 bg-white border-b border-gray-200 flex items-center px-5 shrink-0">
      <div className="flex items-center w-full gap-3">
        <input
          placeholder="Search documentation..."
          onFocus={() => navigate('/search')}
          readOnly
          className="flex-1 h-7.5 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[12px] text-gray-400 placeholder-gray-400 outline-none cursor-pointer hover:border-gray-300 transition-colors"
        />
        <ThemeToggleButton compact />
      </div>
    </header>
  )
}