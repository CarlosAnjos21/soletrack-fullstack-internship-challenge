import { useEffect, useState } from "react";
import type { Model } from "../types/model";

export function useModels() {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    // futuramente buscar do service
    setModels([]);
  }, []);

  return { models };
}