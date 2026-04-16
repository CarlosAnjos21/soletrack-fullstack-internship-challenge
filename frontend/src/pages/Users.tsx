import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./Users.module.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OPERATOR";
  createdAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Gerenciar Usuários</h1>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>Nome</span>
          <span>Email</span>
          <span>Função</span>
          <span>Ações</span>
        </div>

        {users.map((user) => (
          <div key={user.id} className={styles.row}>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>

            <div className={styles.actions}>
              <button>Editar</button>
              <button onClick={() => handleDelete(user.id)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;