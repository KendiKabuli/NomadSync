
import { useState } from 'react';
import API from './api';
import './Auth.css';

function Auth({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await API.post('/auth/register', {
          name,
          email,
          password,
        });
      }

      const response = await API.post('/auth/login', {
        email,
        password,
      });

      sessionStorage.setItem(
        'access_token',
        response.data.access_token
      );

      onLogin(response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <h1>NomadSync</h1>
          <p>Work together, wherever you are.</p>
        </div>

        <div className="auth-heading">
          <h2>
            {isRegistering ? 'Create your account' : 'Welcome back'}
          </h2>

          <p>
            {isRegistering
              ? 'Join your global workspace.'
              : 'Sign in to access your workspace.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {isRegistering && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={isRegistering ? 12 : undefined}
              required
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegistering
                ? 'Create Account'
                : 'Sign In'}
          </button>

        </form>

        <div className="auth-switch">
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            {isRegistering ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <p className="auth-footer">
          NomadSync · Personalizing your global workspace
        </p>

      </div>
    </div>
  );
}

export default Auth;
