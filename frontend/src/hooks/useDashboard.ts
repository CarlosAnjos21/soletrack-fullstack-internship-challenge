import { useMemo } from "react";
import type { Production } from "../types/production";

export function useDashboard(productions: Production[]) {
  const summary = useMemo(() => {
    const total = productions.length;
    const pending = productions.filter(p => p.status === "PENDING").length;
    const inProgress = productions.filter(p => p.status === "IN_PROGRESS").length;
    const completed = productions.filter(p => p.status === "COMPLETED").length;

    return { total, pending, inProgress, completed };
  }, [productions]);

  return summary;
}