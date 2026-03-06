// src/pages/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token, user } = await AuthService.login(form);
      login(token, user);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Card className={styles.loginCard}>
        <div className={styles.header}>
          <h1>Footwear ERP</h1>
          <p>Acesse o painel de produção</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            required
          />
          <Input
            label="Senha"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            required
          />
          <Button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Verificando..." : "Entrar no Sistema"}
          </Button>
        </form>
        <p className={styles.footerText}>
          Ainda não tem acesso? <Link to="/register">Solicitar registro</Link>
        </p>
        {error && <div className={styles.errorBox}>{error}</div>}
      </Card>
    </div>
  );
};

export default Login;