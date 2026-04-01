import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ParrainageStore = {
  parrainId: string | null;
  setParrainId: (id: string) => void;
  clearParrainId: () => void;
};

const useParrainageStore = create(
  persist<ParrainageStore>(
    (set) => ({
      parrainId: null,
      setParrainId: (id) => set({ parrainId: id }),
      clearParrainId: () => set({ parrainId: null }),
    }),
    { name: "parrainage", storage: createJSONStorage(() => localStorage) },
  ),
);

export default useParrainageStore;
