'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationsContextType {
  pendingCount: number;
}

const NotificationsContext = createContext<NotificationsContextType>({
  pendingCount: 0,
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { userData, isSuperAdmin } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Super admins see all parishes — no scoped listener needed here
    // Parish admins listen only to their own parish's pending intentions
    if (!userData?.parishId || isSuperAdmin) {
      setPendingCount(0);
      return;
    }

    const q = query(
      collection(db, 'mass_intentions'),
      where('parishId', '==', userData.parishId),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setPendingCount(snap.size);
      },
      (error) => {
        console.error('Notifications listener error:', error);
      }
    );

    return unsubscribe;
  }, [userData?.parishId, isSuperAdmin]);

  return (
    <NotificationsContext.Provider value={{ pendingCount }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
