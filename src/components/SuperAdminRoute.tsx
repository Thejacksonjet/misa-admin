'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    } else if (!isSuperAdmin) {
      router.push('/dashboard');
    }
  }, [user, loading, isSuperAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
}
