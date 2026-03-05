import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthService } from "../services/authService";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;

    setMessage("");
    setError(false);
    setLoading(true);

    try {
      const payload: { name?: string; password?: string } = {};

      if (name && name !== user.name) {
        payload.name = name;
      }

      if (password.trim() !== "") {
        payload.password = password;
      }

      if (Object.keys(payload).length === 0) {
        setMessage("Nenhuma alteração realizada.");
        setLoading(false);
        return;
      }

      const updatedUser = await AuthService.updateProfile(
        user.id,
        payload
      );

      setUser(updatedUser);
      setPassword("");
      setMessage("Perfil atualizado com sucesso!");
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || "Erro ao atualizar perfil"
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <Card className={styles.formWrapper}>
        <h1 className={styles.title}>Perfil</h1>

        <Input label="Nome" value={name} onChange={setName} />

        <Input
          label="Nova Senha"
          type="password"
          value={password}
          onChange={setPassword}
        />

        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar"}
        </Button>

        {message && (
          <p
            className={`${styles.message} ${
              error ? styles.error : styles.success
            }`}
          >
            {message}
          </p>
        )}
      </Card>
    </div>
  );
};

export default Profile;