import React from "react";
import styles from "./Card.module.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string | number;
  icon?: React.ReactNode; // Agora aceita um componente de ícone
  accentColor?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  icon,
  children,
  accentColor,
  className,
  ...rest
}) => {
  return (
    <div
      className={`${styles.card} ${className || ""}`}
      {...rest}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.info}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {value && <p className={styles.value}>{value}</p>}
        </div>
        {/* O container do ícone agora renderiza o componente Lucide */}
        {icon && <div className={styles.iconContainer}>{icon}</div>}
      </div>
      {children}
    </div>
  );
};

export default Card;
