import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User as ApiUser } from '../services/api';

interface UserProfile {
  id: number;
  email: string;
  role: 'consumer' | 'producer' | 'admin';
  full_name?: string;
  phone?: string;
  farm_name?: string;
  address?: string;
}

interface AuthContextType {
  user: ApiUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string, fullName: string, phone?: string, farmName?: string, address?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier s'il y a un utilisateur connecté dans localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setProfile({
        id: userData.id,
        email: userData.email,
        role: userData.role as 'consumer' | 'producer' | 'admin',
        full_name: userData.full_name,
        phone: userData.phone,
        farm_name: userData.farm_name,
        address: userData.address
      });
    }
    setLoading(false);
  }, []);

// Supprimer la fonction loadProfile complètement car elle n'est plus nécessaire

  const signIn = async (email: string, password: string) => {
    try {
      const user = await apiService.login(email, password);
      if (user) {
        setUser(user);
        setProfile({
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          phone: user.phone,
          farm_name: user.farm_name,
          address: user.address
        });
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: string, fullName: string, phone?: string, farmName?: string, address?: string) => {
    try {
      const newUser = await apiService.register({
        email,
        password,
        role: role as 'consumer' | 'producer',
        full_name: fullName,
        phone: phone || '',
        farm_name: farmName,
        address: address || ''
      });
      
      setUser(newUser);
      setProfile({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        full_name: newUser.full_name,
        phone: newUser.phone,
        farm_name: newUser.farm_name,
        address: newUser.address
      });
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
