import { ProductionOrder } from "../types/productionOrder";
import { ShoeModel } from "../types/shoeModel";

export class ProductionEngine {
  private orders: ProductionOrder[];
  private models: ShoeModel[];

  constructor(orders: ProductionOrder[], models: ShoeModel[]) {
    this.orders = orders;
    this.models = models;
  }

  private getModel(modelId: string) {
    return this.models.find((m) => m.id === modelId);
  }

  // 📦 TOTAL PRODUZIDO
  getTotalProduced() {
    return this.orders.reduce((acc, o) => acc + (o.quantity_produced || 0), 0);
  }

  // 🟢 CONCLUÍDOS HOJE
  getCompletedToday() {
    const today = new Date().toISOString().split("T")[0];
    return this.orders
      .filter((o) => o.status === "COMPLETED")
      .filter((o) => new Date(o.start_date).toISOString().split("T")[0] === today)
      .reduce((acc, o) => acc + (o.quantity_produced || 0), 0);
  }

  // 🏭 EM PRODUÇÃO
  getInProduction() {
    return this.orders.filter((o) => o.status === "IN_PROGRESS").length;
  }

  // ⚡ PRODUÇÃO POR HORA
  getProductionPerHour() {
    return this.orders.reduce((acc, o) => {
      const model = this.getModel(o.model_id);
      if (!model) return acc;
      const rate = 60 / model.production_time_minutes;
      return acc + rate * o.quantity_planned;
    }, 0);
  }

  // ⏱️ TEMPO EM ESTEIRA (HORAS)
  getInProductionHours() {
    return this.orders
      .filter((o) => o.status === "IN_PROGRESS")
      .reduce((acc, o) => {
        const model = this.getModel(o.model_id);
        if (!model) return acc;
        return acc + (o.quantity_planned * model.production_time_minutes) / 60;
      }, 0);
  }

  // 📊 DASHBOARD FINAL
  getDashboard() {
    return {
      totalProduced: this.getTotalProduced(),
      completedToday: this.getCompletedToday(),
      inProduction: this.getInProduction(),
      productionPerHour: this.getProductionPerHour(),
      inProductionHours: this.getInProductionHours(),
    };
  }
}