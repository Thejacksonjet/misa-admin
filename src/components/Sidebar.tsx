'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationsContext';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const parishNavItems: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashibodi' },
  { href: '/parish', icon: 'church', label: 'Taarifa za Parokia' },
  { href: '/schedules', icon: 'calendar_month', label: 'Ratiba za Misa' },
  { href: '/intentions', icon: 'assignment', label: 'Nia za Misa' },
  { href: '/notices', icon: 'campaign', label: 'Matangazo' },
  { href: '/settings', icon: 'settings', label: 'Mipangilio' },
];

const superNavItems: NavItem[] = [
  { href: '/super/parishes', icon: 'location_city', label: 'Parokia Zote' },
  { href: '/super/admins', icon: 'manage_accounts', label: 'Wasimamizi' },
  { href: '/super/analytics', icon: 'bar_chart', label: 'Takwimu' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { userData, isSuperAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pendingCount } = useNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const showBadge = item.href === '/intentions' && pendingCount > 0;
    return (
      <li>
        <Link
          href={item.href}
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <span className="material-symbols-outlined text-xl">{item.icon}</span>
          <span className="font-medium flex-1">{item.label}</span>
          {showBadge && (
            <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold ${
              isActive ? 'bg-white text-primary' : 'bg-red-500 text-white'
            }`}>
              {pendingCount > 99 ? '99+' : pendingCount}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
        w-64 bg-white dark:bg-gray-900
        flex flex-col h-screen
        transform transition-transform duration-200 ease-in-out
        shadow-lg lg:shadow-none
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo & Title */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white">church</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">Misa Admin</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Usimamizi wa Parokia</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Parish Admin section — visible to all */}
          <ul className="space-y-1">
            {parishNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </ul>

          {/* Super Admin section — only for SUPER_ADMIN */}
          {isSuperAdmin && (
            <>
              <div className="mt-6 mb-2 px-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Msimamizi Mkuu
                </p>
              </div>
              <ul className="space-y-1">
                {superNavItems.map((item) => (
                  <NavLink key={item.href} item={item} />
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mb-2"
          >
            <span className="material-symbols-outlined text-xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="font-medium">{theme === 'dark' ? 'Mwanga' : 'Giza'}</span>
          </button>

          {/* User Info */}
          {userData && (
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userData.displayName || userData.email}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isSuperAdmin
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
                  {isSuperAdmin ? 'Super Admin' : 'Parish Admin'}
                </span>
              </div>
            </div>
          )}

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="font-medium">Toka</span>
          </button>
        </div>
      </aside>
    </>
  );
}
