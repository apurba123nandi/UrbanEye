// Mock Authentication Service for Development
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

class MockAuthService {
  private currentUser: MockUser | null = null;
  private listeners: Array<(user: MockUser | null) => void> = [];

  // Mock signup
  async createUserWithEmailAndPassword(email: string, password: string, username: string): Promise<MockUser> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: MockUser = {
      uid: `mock_${Date.now()}`,
      email,
      displayName: username
    };
    
    this.currentUser = user;
    this.notifyListeners(user);
    
    console.log('Mock user created:', user);
    return user;
  }

  // Mock signin
  async signInWithEmailAndPassword(email: string, password: string): Promise<MockUser> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any email/password combination
    const user: MockUser = {
      uid: `mock_${Date.now()}`,
      email,
      displayName: email.split('@')[0] // Use email prefix as username
    };
    
    this.currentUser = user;
    this.notifyListeners(user);
    
    console.log('Mock user signed in:', user);
    return user;
  }

  // Mock signout
  async signOut(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.currentUser = null;
    this.notifyListeners(null);
    
    console.log('Mock user signed out');
  }

  // Mock update profile
  async updateProfile(updates: { displayName?: string }): Promise<void> {
    if (this.currentUser && updates.displayName) {
      this.currentUser.displayName = updates.displayName;
      this.notifyListeners(this.currentUser);
      console.log('Mock profile updated:', this.currentUser);
    }
  }

  // Get current user
  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  // Add auth state listener
  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(user: MockUser | null) {
    this.listeners.forEach(callback => callback(user));
  }
}

export const mockAuth = new MockAuthService(); 