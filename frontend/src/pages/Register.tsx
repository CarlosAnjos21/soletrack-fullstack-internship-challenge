import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import styles from "./Register.module.css";

type UserRole = "ADMIN" | "OPERATOR";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "OPERATOR",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ msg: "", type: "" });

    try {
      await AuthService.register(form, token || "");
      setStatus({ msg: "Operador registrado com sucesso!", type: "success" });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Erro ao registrar.";
      setStatus({ msg: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Novo Acesso</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Nome Completo"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
          />
          <Input
            label="Senha"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required
          />

          <div className={styles.selectGroup}>
            <label className={styles.label}>Nível de Acesso</label>
            <select
              className={styles.select}
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as UserRole })
              }
            >
              <option value="OPERATOR">Operador de Linha</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Processando..." : "Finalizar Cadastro"}
          </Button>
        </form>

        <p className={styles.footer}>
          Já possui conta? <Link to="/login">Voltar ao login</Link>
        </p>

        {status.msg && (
          <div
            className={`${styles.statusMsg} ${status.type === "error" ? styles.error : styles.success}`}
          >
            {status.msg}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Register;
