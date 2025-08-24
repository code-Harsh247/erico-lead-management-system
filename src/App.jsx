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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['Roboto']">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#101720' }}></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
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