import React, { useState, useEffect } from 'react';
import AuthSystem from './components/auth/AuthSystem';
import Dashboard from './components/dashboard/Dashboard';
import { authApi } from './services/apiService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await authApi.checkAuth();
      setIsAuthenticated(true);
    } catch {
      console.log('Not authenticated');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsAuthenticated(false);
    }
  };

  const handleAuthSuccess = async (data) => {
    console.log('Authentication successful:', data);
    try {
      await authApi.checkAuth();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication verification failed:', error);
      setTimeout(async () => {
        try {
          await authApi.checkAuth();
          setIsAuthenticated(true);
        } catch (retryError) {
          console.error('Auth verification retry failed:', retryError);
        }
      }, 1000);
    }
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <AuthSystem onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;