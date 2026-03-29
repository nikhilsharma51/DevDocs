import { NavLink } from 'react-router-dom'
import { currentUser } from '../../data/mockData'

const navItems = [
  { label: "Home",         path: "/" },
  { label: "My docs",      path: "/docs/my" },
  { label: "Team docs",    path: "/docs/team" },
  { label: "Search",       path: "/search" },
  { label: "AI assistant", path: "/ai" },
]

export default function Sidebar() {
  return (
    <aside className="w-[200px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">

      <div className="px-4 py-4 border-b border-dark-border">
        <p className="text-[14px] font-medium text-gray-900">DevDocs</p>
        <p className="text-[11px] text-gray-500 mt-0.5">Engineering team</p>
      </div>

      <nav className="mt-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-[7px] text-[13px] cursor-pointer transition-colors ${
                isActive
                  ? 'bg-dark-hover text-black font-medium'
                  : 'text-gray-400 hover:bg-dark-hover hover:text-gray-500'
              }`
            }
          >
            <div className="w-3 h-3 rounded-sm bg-dark-border flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="mx-4 mt-3 py-[7px] text-[13px] font-medium text-gray-900 bg-dark-surface border border-dark-border rounded-lg hover:bg-dark-hover">
        + New document
      </button>

      <div className="mt-auto px-4 py-3 border-t border-dark-border">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-800 flex-shrink-0">
            {currentUser.initials}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-gray-900 truncate">{currentUser.name}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-800 text-brand-light">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

    </aside>
  )
}