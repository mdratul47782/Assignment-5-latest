import { useState, useEffect } from "react";
import { AuthContext } from "../Context/index";

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Load the initial auth state from localStorage
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : {};
  });

  useEffect(() => {
    // Save auth state to localStorage whenever it changes
    if (auth?.accessToken) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
