import React, { useState, useEffect, useCallback } from "react";
import {jwtDecode} from "jwt-decode";
import { useLogout } from "../Hook/useLogout";

const TokenTimer = ({ token }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const { logout } = useLogout();
  const stableLogout = useCallback(logout, []);
  useEffect(() => {
    if (!token) {
      stableLogout(); // Logs out the user
      return;
    }

    let interval;
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds

      const calculateTimeLeft = () => Math.max(0, expirationTime - Date.now());

      setTimeLeft(calculateTimeLeft());

      interval = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
        if (newTimeLeft <= 0) {
          clearInterval(interval);
          logout(); // Logs out and redirects the user
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to decode token:", error);
      logout(); // Logs out the user in case of invalid token
    }

    return () => clearInterval(interval);
  }, [token, logout]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (timeLeft === null) return <div>Loading...</div>;
  if (timeLeft <= 0) return <div>Session expired. Redirecting...</div>;

  return <div>Time left: {formatTime(timeLeft)}</div>;
};

export default TokenTimer;
