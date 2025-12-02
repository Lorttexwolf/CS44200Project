import { useState, useEffect } from 'react';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  servicePermissions: 'user' | 'admin' | 'campus_admin';
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
        return { success: false, message: result.message };
      }

      return result;
    } catch (err) {
      const message = 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (data: LoginData) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
        return { success: false, message: result.message };
      }

      setUser(result.user);
      return result;
    } catch (err) {
      const message = 'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      setUser(null);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Logout failed' };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
        return { success: false, message: result.message };
      }

      return result;
    } catch (err) {
      const message = 'Verification failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      return result;
    } catch (err) {
      const message = 'Request failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/password-reset', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
        return { success: false, message: result.message };
      }

      return result;
    } catch (err) {
      const message = 'Password reset failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: !!user,
    checkAuth,
  };
}
