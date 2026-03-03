import { useEffect, useState } from "react";
import { productionService } from "../services/productionService";
import type { Production } from "../types/production";

export function useProductions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchProductions() {
    try {
      setLoading(true);
      const data = await productionService.getAll();
      setProductions(data);
    } catch (err) {
      setError("Erro ao buscar produções");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductions();
  }, []);

  return {
    productions,
    loading,
    error,
    refetch: fetchProductions,
  };
}