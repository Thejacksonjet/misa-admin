'use client';

import { useState } from 'react';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
  const { user, userData } = useAuth();

  // Profile form
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData) return;
    try {
      setSavingProfile(true);
      setProfileSuccess('');
      setProfileError('');

      const trimmedName = displayName.trim();

      // Update Firebase Auth display name
      await updateProfile(user, { displayName: trimmedName || null });

      // Update Firestore user doc
      await updateDoc(doc(db, 'users', userData.id), {
        displayName: trimmedName || null,
      });

      setProfileSuccess('Taarifa zako zimehifadhiwa.');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (error) {
      console.error('Profile save error:', error);
      setProfileError('Imeshindwa kuhifadhi. Tafadhali jaribu tena.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('Nenosiri jipya lazima liwe na herufi 8 au zaidi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Nenosiri jipya na uthibitisho hazilingani.');
      return;
    }

    try {
      setSavingPassword(true);

      // Re-authenticate before changing password (Firebase requirement)
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      setPasswordSuccess('Nenosiri limebadilishwa.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (error: unknown) {
      let msg = 'Imeshindwa kubadilisha nenosiri. Tafadhali jaribu tena.';
      if (error instanceof Error) {
        if (error.message.includes('wrong-password') || error.message.includes('invalid-credential')) {
          msg = 'Nenosiri la sasa si sahihi.';
        } else if (error.message.includes('too-many-requests')) {
          msg = 'Majaribio mengi sana. Tafadhali subiri kidogo.';
        }
      }
      setPasswordError(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white';

  const PasswordInput = ({
    label,
    value,
    onChange,
    show,
    onToggle,
    placeholder,
    autoComplete,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    placeholder?: string;
    autoComplete?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={inputClass + ' pr-12'}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <span className="material-symbols-outlined text-xl">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mipangilio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Simamia akaunti yako na mapendeleo
          </p>
        </div>

        <div className="space-y-6">

          {/* Account Info (read-only) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Taarifa za Akaunti
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Barua Pepe</span>
                <span className="font-medium text-gray-900 dark:text-white">{userData?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Jukumu</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  userData?.role === 'SUPER_ADMIN'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
                  {userData?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Parish Admin'}
                </span>
              </div>
              {userData?.parishId && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 dark:text-gray-400">Kitambulisho cha Parokia</span>
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {userData.parishId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Hariri Wasifu
            </h2>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">{profileSuccess}</p>
              </div>
            )}
            {profileError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jina Kamili
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={inputClass}
                  placeholder="Padre Petro Makundi"
                  autoComplete="name"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    Inahifadhi...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">save</span>
                    Hifadhi Wasifu
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Badilisha Nenosiri
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Lazima uweke nenosiri la sasa ili kubadilisha.
            </p>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">{passwordSuccess}</p>
              </div>
            )}
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <PasswordInput
                label="Nenosiri la Sasa"
                value={currentPassword}
                onChange={setCurrentPassword}
                show={showCurrentPw}
                onToggle={() => setShowCurrentPw(!showCurrentPw)}
                autoComplete="current-password"
              />
              <PasswordInput
                label="Nenosiri Jipya"
                value={newPassword}
                onChange={setNewPassword}
                show={showNewPw}
                onToggle={() => setShowNewPw(!showNewPw)}
                placeholder="Herufi 8 au zaidi"
                autoComplete="new-password"
              />
              <PasswordInput
                label="Thibitisha Nenosiri Jipya"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirmPw}
                onToggle={() => setShowConfirmPw(!showConfirmPw)}
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    Inabadilisha...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">lock_reset</span>
                    Badilisha Nenosiri
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Help */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Msaada</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Unahitaji msaada? Wasiliana na msimamizi wa jimbo lako au tuma barua pepe.
            </p>
            <a
              href="mailto:support@misa.app"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-base">email</span>
              Wasiliana na Msaada
            </a>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
