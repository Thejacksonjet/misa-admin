'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { userData } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Mipangilio</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Simamia akaunti yako na mapendeleo
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Taarifa za Akaunti</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Barua Pepe</p>
                <p className="text-gray-900 dark:text-white font-medium">{userData?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Jukumu</p>
                <p className="text-gray-900 dark:text-white font-medium">{userData?.role}</p>
              </div>
              {userData?.parishId && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kitambulisho cha Parokia</p>
                  <p className="text-gray-900 dark:text-white font-medium font-mono text-sm">
                    {userData.parishId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Help */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Msaada</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unahitaji msaada? Wasiliana na msimamizi wa jimbo lako au tuma barua pepe.
            </p>
            <a
              href="mailto:support@misa.app"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">email</span>
              Wasiliana na Msaada
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
