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

      // 🔐 Atualiza contexto de autenticação
      login(token, user);

      // 🚀 Redireciona para Home
      navigate("/home", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Falha na autenticação. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1>Bem-vindo</h1>
          <p>Entre com suas credenciais</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            required
          />

          <Input
            placeholder="Senha"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Autenticando..." : "Entrar"}
          </Button>
        </form>

        <p className={styles.footerText}>
          Não tem conta? <Link to="/register">Registre-se aqui</Link>
        </p>

        {error && <div className={styles.errorBox}>{error}</div>}
      </Card>
    </div>
  );
};

export default Login;