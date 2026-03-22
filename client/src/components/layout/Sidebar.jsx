import { currentUser } from '../../data/mockData'

const navItems = [
  { label: "Home",         path: "/dashboard" },
  { label: "My docs",      path: "/docs/my" },
  { label: "Team docs",    path: "/docs/team" },
  { label: "Search",       path: "/search" },
  { label: "AI assistant", path: "/ai" },
]

export default function Sidebar() {
  return (
    <aside className="w-[200px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">

      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-200">
        <p className="text-[14px] font-medium text-gray-900">DevDocs</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Engineering team</p>
      </div>

      {/* Nav */}
      <nav className="mt-2">
        {navItems.map(item => (
          <div
            key={item.path}
            className="flex items-center gap-2 px-4 py-[7px] text-[13px] text-gray-500 cursor-pointer hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="w-3 h-3 rounded-sm bg-gray-300 flex-shrink-0" />
            {item.label}
          </div>
        ))}
      </nav>

      {/* New doc button */}
      <button className="mx-4 mt-3 py-[7px] text-[13px] font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
        + New document
      </button>

      {/* User info */}
      <div className="mt-auto px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-800 flex-shrink-0">
            {currentUser.initials}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-gray-900 truncate">{currentUser.name}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-800">{currentUser.role}</span>
          </div>
        </div>
      </div>

    </aside>
  )
}