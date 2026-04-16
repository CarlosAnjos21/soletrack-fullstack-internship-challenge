// src/pages/Profile.tsx
import React, { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthService } from "../services/authService";
import Button from "../components/Button";
import Input from "../components/Input";
import { Toast } from "../components/Toast";
import styles from "./Profile.module.css";

const AVATAR_COLORS = ["#3b82f6", "#2563eb", "#0ea5e9", "#6366f1", "#8b5cf6"];

const Profile: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [toast, setToast] = useState({
    message: "",
    type: "success" as "success" | "error",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {

      console.log("USER:", user);
      
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email ?? "",
      }));
    }
  }, [user]);

  const avatarData = useMemo(() => {
    if (!user) return { bg: "#3b82f6", initials: "" };
    const index = user.name.charCodeAt(0) % AVATAR_COLORS.length;
    const initials = user.name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return { bg: AVATAR_COLORS[index], initials };
  }, [user]);

  const isDirty = useMemo(() => {
    if (!user) return false;
    return (
      formData.name !== user.name ||
      formData.email !== (user.email ?? "") ||
      formData.password !== ""
    );
  }, [formData, user]);

  const handleUpdate = async () => {
    if (!user) return;

    if (formData.password && formData.password !== formData.confirm) {
      setToast({ message: "As senhas não coincidem.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string> = {};
      if (formData.name !== user.name) payload.name = formData.name;
      if (formData.email !== (user.email ?? "") && formData.email !== "")
        payload.email = formData.email;
      if (formData.password) payload.password = formData.password;

      if (Object.keys(payload).length === 0) {
        setToast({ message: "Nenhuma alteração detectada.", type: "error" });
        return;
      }

      const updatedUser = await AuthService.updateProfile(user.id, payload);
      setUser(updatedUser);
      setFormData((prev) => ({ ...prev, password: "", confirm: "" }));
      setToast({ message: "Perfil atualizado com sucesso!", type: "success" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar perfil.";
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1>Minha Conta</h1>
          <p className={styles.pageSubtitle}>
            Gerencie suas informações e segurança
          </p>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userName}>{user.name}</span>
          <div
            className={styles.avatarHeader}
            style={{ backgroundColor: avatarData.bg }}
          >
            {avatarData.initials}
          </div>
        </div>
      </header>

      <div className={styles.profileGrid}>
        <aside className={styles.statsCard}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Status</span>
            <span className={`${styles.statValue} ${styles.statValueActive}`}>
              Ativo
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Função</span>
            <span className={styles.statValue}>{user.role ?? "Usuário"}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Membro desde</span>
            <span className={styles.statValue} style={{ fontSize: "1rem" }}>
              {memberSince}
            </span>
          </div>
        </aside>

        <main className={styles.formCard}>
          <section>
            <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
            <div className={styles.fieldGroup}>
              <Input
                label="Nome"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
              <Input
                label="E-mail"
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
              />
            </div>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Segurança</h2>
            <div className={styles.fieldGroup}>
              <Input
                label="Nova Senha"
                type="password"
                value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })}
                placeholder="Mínimo 6 caracteres"
              />
              <Input
                label="Confirmar Senha"
                type="password"
                value={formData.confirm}
                onChange={(v) => setFormData({ ...formData, confirm: v })}
                placeholder="Repita a nova senha"
              />
            </div>
          </section>

          <Button
            className={styles.btnAction}
            onClick={handleUpdate}
            disabled={!isDirty || loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </main>
      </div>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, message: "" })}
        />
      )}
    </div>
  );
};

export default Profile;
