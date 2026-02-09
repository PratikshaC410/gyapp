import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export const AuthContext = createContext();
const API = process.env.REACT_APP_BACKEND_BASEURL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const store_token_ls = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
  };

  const logoutuser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isloggedin = !!token;

  const userAuthentication = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/auth/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.userData || data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      userAuthentication();
    } else {
      setLoading(false);
    }
  }, [token, userAuthentication]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        store_token_ls,
        logoutuser,
        isloggedin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
