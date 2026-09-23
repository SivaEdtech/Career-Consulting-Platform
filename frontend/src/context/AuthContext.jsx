import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user data from backend
  const fetchUser = async () => {
    setLoading(true);

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/getMe`,
        { withCredentials: true }
      );

      console.log("getMe RESPONSE:", res);
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user in fetchUser:", err, err?.response?.data);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);  //mount and unmount

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier context usage
export const useAuth = () => useContext(AuthContext);