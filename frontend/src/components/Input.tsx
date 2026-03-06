import React from "react";
import styles from "./Input.module.css";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  onChange,
  className,
  ...rest
}) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={`${styles.input} ${className || ""}`}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
};

export default Input;
