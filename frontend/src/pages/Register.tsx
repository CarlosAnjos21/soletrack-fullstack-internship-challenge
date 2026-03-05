import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

import styles from "./Register.module.css";

type Role = "ADMIN" | "OPERATOR";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth(); // 🔑 pega token e usuário do contexto

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "OPERATOR",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 🔐 só permite registrar se tiver token (usuário logado)
      await AuthService.register(form, token!);

      setMessage("Registro concluído com sucesso!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao registrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formWrapper}>
        <Card className={styles.card}>
          <h1 className={styles.title}>Criar Conta</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              placeholder="Nome Completo"
              value={form.name}
              onChange={(v) => handleChange("name", v)}
              required
            />

            <Input
              placeholder="E-mail"
              type="email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              required
            />

            <Input
              placeholder="Senha"
              type="password"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
              required
            />

            <select
              className={styles.select}
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value as Role)}
            >
              <option value="OPERATOR">Operador</option>
              <option value="ADMIN">Administrador</option>
            </select>

            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Confirmar Cadastro"}
            </Button>
          </form>

          <p className={styles.footerText}>
            Já tem conta? <Link to="/login">Faça login</Link>
          </p>

          {message && <div className={styles.successLabel}>{message}</div>}
          {error && <div className={styles.errorBox}>{error}</div>}
        </Card>
      </div>
    </div>
  );
};

export default Register;