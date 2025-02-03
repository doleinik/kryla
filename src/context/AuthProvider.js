import React, { createContext, useState } from 'react';

const AuthContext = createContext({});

const initialState = {
  token: null,
  isLoggedIn: false
};

export function AuthProvider({ children }) {

  const [auth, setAuth] = useState(() => {

    // Load auth state from localStorage if it exists
    const authData = localStorage.getItem('auth');

    return JSON.parse(authData) || initialState;
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );

}

export default AuthContext;
