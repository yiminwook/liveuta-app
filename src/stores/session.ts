import { SESSION_STORAGE_KEY } from "@/constants/storage-key";
import { deleteItemAsync, getItem, setItem } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TSessionState = {
  session: any | null;
};

type TSessionAction = {
  setSession: (session: any) => void;
  resetSession: () => void;
};

type TSessionStore = TSessionState & { actions: TSessionAction };

export const useSession = create<TSessionStore>()(
  persist(
    (set) => ({
      session: null,
      actions: {
        setSession: (session: any) => set(() => ({ session })),
        resetSession: () => set(() => ({ session: null })),
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => ({
        getItem: getItem,
        setItem: setItem,
        removeItem: deleteItemAsync,
      })),
      version: 1,
      partialize: (state) => ({ session: state.session }),
    }
  )
);
