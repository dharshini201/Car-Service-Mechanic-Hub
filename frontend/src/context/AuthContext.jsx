import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🔄 Authentication loading state
  const [loading, setLoading] = useState(true);

  // Load login data from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user data:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      }
    }

    // Authentication data loaded
    setLoading(false);
  }, []);

  // Login
  const login = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // Check authentication
  const isAuthenticated = !!token;

  // Get current role
  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;