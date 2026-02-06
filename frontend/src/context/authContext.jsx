import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const login = async (inputs) => {
    //TO DO
    const res = await axios.post("http://localhost:8800/backend/auth/login", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data);
  };

  // Refresh user data from DB on app load so profilePic etc. stay up to date
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser?.id) return;
      try {
        const res = await axios.get(
          "http://localhost:8800/backend/users/find/" + currentUser.id,
          { withCredentials: true }
        );
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to refresh user data:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};