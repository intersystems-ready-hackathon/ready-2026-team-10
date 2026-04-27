import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const FAKE_USERS = [{ username: 'admin', password: 'admin' }];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  function login(username, password) {
    const match = FAKE_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (match) {
      setUser({ username });
      setError('');
      return true;
    }
    setError('Invalid username or password.');
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
