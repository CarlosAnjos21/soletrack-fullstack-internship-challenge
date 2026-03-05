import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

const Button: React.FC<ButtonProps> = ({ danger, className, ...rest }) => {
  return (
    <button
      className={`${styles.button} ${danger ? styles.danger : styles.primary} ${className || ""}`}
      {...rest}
    />
  );
};

export default Button;