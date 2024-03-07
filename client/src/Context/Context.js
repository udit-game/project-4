// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToke] = useState(null);
  const [filterPopOn, setfilterPopOn] = useState(false);


  const checktoken = async ({token}) => {
     try {
       localStorage.setItem('token', token);
       const response = await axios.post('http://localhost:8080/verify-token', {token: token});
     if (response.status === 200) {
       const userData = response.data; // Assuming the server sends back user information
       setUser(userData);
       setToke(token);
     }
     } catch (error) {
       console.error('Error:', error);
     }
  };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token')
      };

      return (
        <AuthContext.Provider value={{ token, user, checktoken, logout, setfilterPopOn, filterPopOn }}>
          {children}
        </AuthContext.Provider>
      );
    };

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };