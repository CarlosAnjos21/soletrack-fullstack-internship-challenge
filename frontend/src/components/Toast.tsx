import React, { useEffect, useState } from "react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${type === "error" ? styles.error : styles.success}`}>
      {message}
    </div>
  );
};