import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ShieldAlert, LogOut, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { updateUserDisplayName, deleteUserAccountAndData } from '../../services/auth/authService';
import { validateDisplayName } from '../../validators/authValidator';
import { getFriendlyErrorMessage } from '../../lib/errors';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, refreshProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || user?.displayName || ''
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setSuccessMessage(null);
    setErrorMessage(null);

    const validationErr = validateDisplayName(displayName);
    if (validationErr) {
      setNameError(validationErr);
      return;
    }

    setIsUpdatingName(true);
    try {
      await updateUserDisplayName(displayName.trim());
      await refreshProfile();
      setSuccessMessage('Display name updated successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteUserAccountAndData();
      navigate('/login');
    } catch (err) {
      setErrorMessage(getFriendlyErrorMessage(err));
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal profile and account preferences.
        </p>
      </div>

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Profile Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Profile Information
        </h2>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <Input
            label="Display Name"
            required
            leftIcon={<User className="w-4 h-4" />}
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (nameError) setNameError(null);
            }}
            error={nameError || undefined}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 text-sm py-2 px-3 pl-9 text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Managed securely via Firebase Authentication.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isUpdatingName}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Account Session Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Session & Security
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-800">Sign Out</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely log out of this browser session.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<LogOut className="w-4 h-4" />}
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-rose-50/50 rounded-xl border border-rose-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-rose-700 border-b border-rose-200/60 pb-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <h2 className="text-base font-semibold">Danger Zone</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-800">Delete Account</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently delete your account, user profile, and all associated task data from Firestore.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog for Deletion */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Permanently delete account?"
        message="This will completely remove your authentication credentials and permanently delete all your tasks from Firestore. This action is irreversible."
        confirmLabel="Delete Account & All Data"
        isLoading={isDeletingAccount}
      />
    </div>
  );
};
