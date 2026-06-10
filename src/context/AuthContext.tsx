import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { mockAuth } from '../services/mockAuthService';

// Use real Firebase auth for testing
const isDevelopment = false;

interface AuthContextType {
  currentUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, username: string) => {
    if (isDevelopment) {
      await mockAuth.createUserWithEmailAndPassword(email, password, username);
    } else {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: username });
    }
  };

  const login = async (email: string, password: string) => {
    if (isDevelopment) {
      await mockAuth.signInWithEmailAndPassword(email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  };

  const logout = async () => {
    if (isDevelopment) {
      await mockAuth.signOut();
    } else {
      await signOut(auth);
    }
  };

  const updateUsername = async (username: string) => {
    if (isDevelopment) {
      await mockAuth.updateProfile({ displayName: username });
    } else if (currentUser) {
      await updateProfile(currentUser, { displayName: username });
    }
  };

  useEffect(() => {
    if (isDevelopment) {
      const unsubscribe = mockAuth.onAuthStateChanged((user) => {
        setCurrentUser(user as FirebaseUser);
        setLoading(false);
      });

      return unsubscribe;
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });

      return unsubscribe;
    }
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUsername,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 