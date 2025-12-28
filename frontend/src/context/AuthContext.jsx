import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  // user = null => not logged in
  // user = {}   => logged in user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 PAGE REFRESH KE BAAD LOGIN STATE SAFE RAKHNE KE LIYE
  useEffect(() => {
    const storedUser = localStorage.getItem("nizmart_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 🔹 LOGIN FUNCTION (API ke baad yahin call karoge)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("nizmart_user", JSON.stringify(userData));
  };

  // 🔹 LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    localStorage.removeItem("nizmart_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
