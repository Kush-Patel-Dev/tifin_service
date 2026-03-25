import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Refresh user data to get the latest emailVerified status
          await currentUser.reload();
          const refreshedUser = auth.currentUser;

          /**
           * SECURITY GUARD:
           * Exempt the static admin account from verification.
           * Force logout for all other unverified users.
           */
          const isAdmin = refreshedUser.email === "admin@gmail.com";
          if (!refreshedUser.emailVerified && !isAdmin) {
            await signOut(auth);
            setUser(null);
          } else {
            setUser(refreshedUser);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth status sync error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
