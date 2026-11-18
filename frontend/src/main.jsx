
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Auth from './Auth.jsx';
import API from './api.js';

function Root() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem('access_token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        sessionStorage.removeItem('access_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    setUser(null);
  };

  if (isLoading) {
    return <div>Loading NomadSync...</div>;
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return <App user={user} onLogout={handleLogout} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
