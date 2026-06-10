import React from 'react';
import { useApp } from '../context/AppContext';

const DebugPanel: React.FC = () => {
  const { issues, currentUser, isAuthenticated } = useApp();

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="font-semibold text-gray-800 mb-2">🔧 Debug Information</h3>
      <div className="text-sm space-y-1">
        <div><strong>Authentication:</strong> {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}</div>
        <div><strong>Current User:</strong> {currentUser ? JSON.stringify(currentUser) : 'None'}</div>
        <div><strong>Total Issues:</strong> {issues.length}</div>
        <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
        <div><strong>App Status:</strong> ✅ Running</div>
      </div>
    </div>
  );
};

export default DebugPanel; 