import { create } from "zustand";

export const configStore = create((set) => ({
  config: {
    category: null,
    role: null,
    supplier: null,
    purchase_status: null,
    brand: null,
    expense_type : null,
  },
  setConfig: (params) =>
    set((state) => ({
      config: params,
    })),
}));
