// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { label: "Home", path: "/" },
  { label: "My docs", path: "/docs/my" },
  { label: "Team docs", path: "/docs/team" },
  { label: "Search", path: "/search" },
  { label: "AI assistant", path: "/ai" },
];

export default function Sidebar() {
  const { profile, user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    const { error } = await signOut();
    if (!error) navigate("/login", { replace: true });
  }

  const displayName =
    profile?.name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "") ||
    (loading ? "Loading..." : "User");

  // get initials from the best available display name
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <aside className="w-50 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="px-4 py-4 border-b border-gray-200">
        <p className="text-[14px] font-medium text-gray-900">DevDocs</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Engineering team</p>
      </div>

      <nav className="mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.75 text-[13px] cursor-pointer transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <div className="w-3 h-3 rounded-sm bg-gray-300 shrink-0" />
            {item.label}
          </NavLink>
        ))}

        {profile?.role === "admin" && (
          <NavLink
            to="/team/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.75 text-[13px] cursor-pointer transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <div className="w-3 h-3 rounded-sm bg-gray-300 shrink-0" />
            Team settings
          </NavLink>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-1.75 text-[13px] cursor-pointer transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <div className="w-3 h-3 rounded-sm bg-gray-300 shrink-0" />
          Profile
        </NavLink>
      </nav>

      <NavLink
        to="/docs/new"
        className="mx-4 mt-3 py-1.75 text-[13px] font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-center"
      >
        + New document
      </NavLink>

      <div className="mt-auto border-t border-gray-200">
        {/* User info */}
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-800 shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-gray-900 truncate">
              {displayName}
            </p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-800 capitalize">
              {profile?.role || "developer"}
            </span>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2.5 text-left text-[12px] text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
