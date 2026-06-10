import React, { useState } from 'react';
import { User, Edit3, Save, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const ProfilePage: React.FC = () => {
  const { currentUser: authUser, updateUsername } = useAuth();
  const { currentUser, isAuthenticated } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser?.username || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveUsername = async () => {
    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setMessage({ type: 'error', text: 'Username must be at least 3 characters long' });
      return;
    }

    setIsUpdating(true);
    setMessage(null);

    try {
      await updateUsername(newUsername.trim());
      setMessage({ type: 'success', text: 'Username updated successfully!' });
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update username:', error);
      setMessage({ type: 'error', text: 'Failed to update username. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setNewUsername(currentUser?.username || '');
    setIsEditing(false);
    setMessage(null);
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to view and edit your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <User className="w-8 h-8 text-cyan-600" />
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Profile Information */}
        <div className="space-y-6">
          {/* Username Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Username</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-cyan-600 hover:text-indigo-700 text-sm font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Username
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter new username"
                    disabled={isUpdating}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Username must be at least 3 characters long
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveUsername}
                    disabled={isUpdating || !newUsername.trim() || newUsername.trim().length < 3}
                    className="flex items-center space-x-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isUpdating ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{currentUser.username}</p>
                  <p className="text-sm text-gray-500">Current username</p>
                </div>
              </div>
            )}
          </div>

          {/* Email Section (Read-only) */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Address</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">@</span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{currentUser.email}</p>
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-cyan-600">{currentUser.reportsCount || 0}</p>
                <p className="text-sm text-gray-600">Reports Submitted</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{currentUser.validationScore || 0}</p>
                <p className="text-sm text-gray-600">Validation Score</p>
              </div>
            </div>
          </div>

          {/* Firebase User Info (Development Only) */}
          {process.env.NODE_ENV === 'development' && authUser && (
            <div className="border border-gray-200 rounded-lg p-6 bg-yellow-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Firebase User Info (Dev)</h3>
              <div className="space-y-2 text-sm">
                <p><strong>UID:</strong> {authUser.uid}</p>
                <p><strong>Display Name:</strong> {authUser.displayName || 'Not set'}</p>
                <p><strong>Email:</strong> {authUser.email}</p>
                <p><strong>Email Verified:</strong> {authUser.emailVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 