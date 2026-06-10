import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Camera, 
  Map, 
  FileText, 
  Trophy, 
  BarChart3, 
  Shield, 
  LogOut,
  User,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const location = useLocation();
  const { currentUser, isAuthenticated, logout } = useApp();
  const { currentUser: authUser, logout: authLogout, updateUsername } = useAuth();

  const navigation = [
    { name: 'Report', href: '/report', icon: Camera },
    { name: 'Live Map', href: '/map', icon: Map },
    { name: 'My Reports', href: '/reports', icon: FileText },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  // Add Profile link for authenticated users
  if (isAuthenticated && currentUser) {
    navigation.push({ name: 'Profile', href: '/profile', icon: User });
  }

  if (currentUser?.isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Shield });
  } else {
    navigation.push({ name: 'Admin Login', href: '/admin-login', icon: Shield });
  }

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    authLogout();
    logout();
    setShowUserMenu(false);
  };

  const handleEditUsername = async () => {
    if (newUsername.trim().length >= 3) {
      try {
        await updateUsername(newUsername.trim());
        setShowEditUsername(false);
        setNewUsername('');
        setShowUserMenu(false);
      } catch (error) {
        console.error('Failed to update username:', error);
      }
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">UrbanEye</span>
              <span className="text-xs bg-cyan-100 text-indigo-700 px-2 py-1 rounded-full font-medium">Team Technova</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-cyan-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-cyan-600 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-cyan-600" />
                  </div>
                  <span className="text-sm font-medium">{currentUser.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        setShowEditUsername(true);
                        setNewUsername(currentUser.username);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit3 className="w-4 h-4 inline mr-2" />
                      Edit Username
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}

                {/* Edit Username Modal */}
                {showEditUsername && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                      <h3 className="text-lg font-semibold mb-4">Edit Username</h3>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter new username"
                      />
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => {
                            setShowEditUsername(false);
                            setNewUsername('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditUsername}
                          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-cyan-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-cyan-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-cyan-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {isAuthenticated && currentUser && (
              <div className="border-t pt-2 mt-2">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Logged in as {currentUser.username}
                </div>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cyan-600 hover:bg-gray-50 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;