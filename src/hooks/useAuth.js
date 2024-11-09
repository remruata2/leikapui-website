import { useState, useEffect } from "react";
import { isAuthenticated } from "../utilities/authUtils";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return isLoggedIn;
};
