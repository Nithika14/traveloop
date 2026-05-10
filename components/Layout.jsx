import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Home,
  Map,
  Users,
  User,
  LogOut,
  Globe,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#1A1A2E] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-16' : 'w-56'
        } transition-all duration-300 bg-[#16213E] flex flex-col border-r border-purple-900/30`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-purple-900/30">
          <Globe className="text-purple-400 shrink-0" size={24} />

          {!collapsed && (
            <span
              className="font-bold text-white text-lg"
              style={{ fontFamily: 'Sora' }}
            >
              Traveloop
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm
                ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:bg-purple-900/30 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />

              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-purple-900/30 space-y-1">
          {!collapsed && (
            <div className="px-3 py-2 text-xs text-gray-400">
              👋 {user?.firstName}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all text-sm"
          >
            <LogOut size={18} className="shrink-0" />

            {!collapsed && <span>Logout</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-500 hover:text-white text-xs transition-all"
          >
            {collapsed ? '→' : '← Collapse'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}