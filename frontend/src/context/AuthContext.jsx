import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Normalize user data from different API responses into a consistent shape
const normalizeUser = (data) => {
  if (!data) return null;
  
  // If getMe response (has profile object)
  if (data.profile) {
    return {
      id: data.user?.id || data.profile?.id,
      email: data.profile?.email || data.user?.email,
      full_name: data.profile?.full_name || data.user?.user_metadata?.full_name || '',
      registration_number: data.profile?.registration_number || data.user?.user_metadata?.registration_number || '',
      role: data.profile?.role || 'student',
    };
  }
  
  // If Supabase auth user object (from login/register)
  return {
    id: data.id,
    email: data.email,
    full_name: data.user_metadata?.full_name || '',
    registration_number: data.user_metadata?.registration_number || '',
    role: data.role || 'student',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          const response = await getMe();
          setUser(normalizeUser(response.data));
          setToken(storedToken);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('access_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const userData = response.data.user;
    const access_token = response.data.session?.access_token;
    localStorage.setItem('access_token', access_token);
    setToken(access_token);
    setUser(normalizeUser(userData));
    return response;
  };

  const register = async (data) => {
    const response = await registerUser(data);
    const userData = response.data.user;
    const access_token = response.data.session?.access_token;
    
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
    }
    setUser(normalizeUser(userData));
    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API error:', error);
    }
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

