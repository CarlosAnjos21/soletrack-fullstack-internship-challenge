// src/pages/Profile.tsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthService } from "../services/authService";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { Toast } from "../components/Toast";
import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const payload: any = {};
      if (name && name !== user.name) payload.name = name;
      if (password.trim() !== "") payload.password = password;

      if (Object.keys(payload).length === 0) {
        setToast({ message: "Nenhuma alteração detectada.", type: "error" });
        return;
      }

      const updatedUser = await AuthService.updateProfile(user.id, payload);
      setUser(updatedUser);
      setPassword("");
      setToast({ message: "Perfil atualizado com sucesso!", type: "success" });
    } catch (err: any) {
      setToast({ message: "Erro ao atualizar perfil", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1>Minha Conta</h1>
      </header>
      <Card className={styles.formWrapper} accentColor>
        <Input label="Seu Nome" value={name} onChange={setName} />
        <Input label="Nova Senha" type="password" value={password} onChange={setPassword} placeholder="Deixe em branco para não alterar" />
        <Button onClick={handleUpdate} disabled={loading} className={styles.btn}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </Card>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({...toast, message: ""})} />}
    </div>
  );
};

export default Profile;