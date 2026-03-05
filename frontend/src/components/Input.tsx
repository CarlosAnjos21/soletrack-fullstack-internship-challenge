import React from "react";
import styles from "./Input.module.css";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, className, ...rest }) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={`${styles.input} ${className || ""}`}
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Input;