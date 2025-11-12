import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiRequest, authUtils, userDataUtils } from '../services/api';

type Role = 'producer' | 'consumer' | 'admin';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  phone_number?: string | null;
  code_pin?: string | null;
  google_id?: string | null;
  profile_picture?: string | null;
  is_active: boolean;
  is_staff: boolean;
  verified_email: boolean;
  farm_name?: string | null;
  farm_address?: string | null;
  farm_description?: string | null;
  date_joined: string;
  otp_code?: string | null;
  otp_generated_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  signUp: (payload: {
    email: string;
    first_name: string;
    last_name: string;
    role: Role;
    password: string;
    farm_name?: string | null;
    farm_address?: string | null;
    farm_description?: string | null;
  }) => Promise<any>;
  updateUser: (payload: {
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: Role;
    phone_number?: string | null;
    farm_name?: string | null;
    farm_address?: string | null;
    farm_description?: string | null;
  }) => Promise<User>;
  verifyEmail: (payload: { email: string; otp_code: string }) => Promise<any>;
  resendActivation: (payload: { email: string }) => Promise<any>;
  requestPasswordReset: (payload: { email_or_phone: string }) => Promise<any>;
  confirmPasswordReset: (payload: { new_password: string; otp_code: string }) => Promise<any>;
  setPassword: (payload: { new_password: string }) => Promise<any>;
  changePassword: (old_password: string, new_password: string) => Promise<string | undefined>;
  checkEmailExists: (payload: { email: string }) => Promise<{ exists: boolean }>;
  googleLogin: (payload: { code: string }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = userDataUtils.getUserData();
    return storedUser ?? null;
  });

  const login = async (email: string, password: string) => {
    const response = await apiRequest({
      url: '/authentication/login/',
      method: 'POST',
      data: { email, password },
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    const access: string | undefined = data?.access;
    const refresh: string | undefined = data?.refresh;
    const userObj: User | undefined = data?.user;

    if (access && refresh) {
      authUtils.setAccessToken(access);
      authUtils.setRefreshToken(refresh);
    }

    if (userObj) {
      setUser(userObj);
      userDataUtils.setUserData(userObj);
    }
  };

  const logout = () => {
    setUser(null);
    authUtils.clearAuth();
  };

  const signUp: AuthContextType['signUp'] = async (payload) => {
    const response = await apiRequest({
      url: '/authentication/register/',
      method: 'POST',
      data: payload,
    });
    const data = await response.json();
    return data;
  };

  const updateUser: AuthContextType['updateUser'] = async (payload) => {
    const response = await apiRequest({
      url: '/authentication/profile/',
      method: 'PATCH',
      data: payload,
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    const updatedUser: User = await response.json();
    setUser(updatedUser);
    userDataUtils.setUserData(updatedUser);
    return updatedUser;
  };

  const verifyEmail: AuthContextType['verifyEmail'] = async ({ email, otp_code }) => {
    const response = await apiRequest({
      url: '/authentication/activate-email/',
      method: 'POST',
      data: { email, otp_code },
    });
    const data = await response.json();
    if (user && user.email === email && data?.verified_email === true) {
      setUser({ ...user, verified_email: true });
      userDataUtils.setUserData({ ...user, verified_email: true });
    }
    return data;
  };

  const resendActivation: AuthContextType['resendActivation'] = async ({ email }) => {
    const response = await apiRequest({
      url: '/authentication/resend-activation/',
      method: 'POST',
      data: { email },
    });
    return response.json();
  };

  const requestPasswordReset: AuthContextType['requestPasswordReset'] = async ({ email_or_phone }) => {
    const response = await apiRequest({
      url: '/authentication/password-reset-request/',
      method: 'POST',
      data: { email_or_phone },
    });
    return response.json();
  };

  const confirmPasswordReset: AuthContextType['confirmPasswordReset'] = async ({ new_password, otp_code }) => {
    const response = await apiRequest({
      url: '/authentication/password-reset-confirm/',
      method: 'POST',
      data: { new_password, otp_code },
    });
    return response.json();
  };

  const setPassword: AuthContextType['setPassword'] = async ({ new_password }) => {
    const response = await apiRequest({
      url: '/authentication/set-password/',
      method: 'PUT',
      data: { new_password },
    });
    return response.json();
  };

  const changePassword: AuthContextType['changePassword'] = async (old_password, new_password) => {
    const response = await apiRequest({
      url: '/authentication/change-password/',
      method: 'POST',
      data: { current_password: old_password, new_password },
    });
    const data = await response.json();
    return data?.message;
  };

  const checkEmailExists: AuthContextType['checkEmailExists'] = async ({ email }) => {
    const response = await apiRequest({
      url: '/authentication/check-email-exists/',
      method: 'POST',
      data: { email },
    });
    const data = await response.json();
    return { exists: !!data?.exists };
  };

  const googleLogin: AuthContextType['googleLogin'] = async ({ code }) => {
    const response = await apiRequest({
      url: '/authentication/google-login/',
      method: 'POST',
      data: { code },
    });

    if (!response.ok) {
      throw new Error('Google login failed');
    }

    const data = await response.json();
    const access: string | undefined = data?.access;
    const refresh: string | undefined = data?.refresh;
    const userObj: User | undefined = data?.user;

    if (access && refresh) {
      authUtils.setAccessToken(access);
      authUtils.setRefreshToken(refresh);
    }
    if (userObj) {
      setUser(userObj);
      userDataUtils.setUserData(userObj);
      return userObj;
    }
    throw new Error('Invalid Google login response');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        signUp,
        updateUser,
        verifyEmail,
        resendActivation,
        requestPasswordReset,
        confirmPasswordReset,
        setPassword,
        changePassword,
        checkEmailExists,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
