// src/components/Card.tsx
import React from "react";
import styles from "./Card.module.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string | number;
  accentColor?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  children,
  accentColor,
  className,
  ...rest
}) => {
  return (
    <div
      className={`${styles.card} ${accentColor ? styles.accent : ""} ${className || ""}`}
      {...rest}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      {value && <p className={styles.value}>{value}</p>}
      {children}
    </div>
  );
};

export default Card;
