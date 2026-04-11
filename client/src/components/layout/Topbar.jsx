// src/components/layout/Topbar.jsx
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const navigate = useNavigate()

  return (
    <header className="h-[52px] bg-white border-b border-gray-200 flex items-center px-5 flex-shrink-0">
      <input
        placeholder="Search documentation..."
        onFocus={() => navigate('/search')}
        readOnly
        className="flex-1 h-[30px] bg-gray-50 border border-gray-200 rounded-lg px-3 text-[12px] text-gray-400 placeholder-gray-400 outline-none cursor-pointer hover:border-gray-300 transition-colors"
      />
    </header>
  )
}