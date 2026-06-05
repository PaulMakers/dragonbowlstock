"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type User = {
  id: string;
  username: string;
  role: 'admin' | 'pegawai';
  nama: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('db_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('db_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('db_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('db_user');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
}