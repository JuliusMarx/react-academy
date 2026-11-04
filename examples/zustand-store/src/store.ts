import { create } from 'zustand';

type BearState = {
  bears: number;
  fish: number;
  addBear: () => void;
  addFish: (amount: number) => void;
  reset: () => void;
};

// The store is a hook. State and actions live together; set() merges the changes.
export const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  fish: 10,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  addFish: (amount) => set((state) => ({ fish: state.fish + amount })),
  reset: () => set({ bears: 0, fish: 10 }),
}));
