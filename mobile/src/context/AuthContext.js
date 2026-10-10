import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import client, { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = await SecureStore.getItemAsync('campusfix_token');
      const savedUser = await SecureStore.getItemAsync('campusfix_user');
      if (token && savedUser) {
        setAuthToken(token);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
    restoreSession();
  }, []);

  async function signIn(email, password) {
    const { data } = await client.post('/auth/login', { email, password });
    await SecureStore.setItemAsync('campusfix_token', data.token);
    await SecureStore.setItemAsync('campusfix_user', JSON.stringify(data.user));
    setAuthToken(data.token);
    setUser(data.user);
  }

  async function signUp(name, email, password) {
    const { data } = await client.post('/auth/register', { name, email, password });
    await SecureStore.setItemAsync('campusfix_token', data.token);
    await SecureStore.setItemAsync('campusfix_user', JSON.stringify(data.user));
    setAuthToken(data.token);
    setUser(data.user);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('campusfix_token');
    await SecureStore.deleteItemAsync('campusfix_user');
    setAuthToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
