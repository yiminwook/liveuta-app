import { APP_STORAGE_KEY } from "@/constants/storage-key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TAppState = {
  locale: string;
};

export type TAppAction = {
  setLocale: (locale: string) => void;
};

export type TAppStore = TAppState & { actions: TAppAction };

export const useApp = create<TAppStore>()(
  persist(
    (set) => ({
      locale: "ko",
      actions: {
        setLocale: (locale) => set({ locale }),
      },
    }),
    {
      name: APP_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({
        locale: state.locale,
      }),
    }
  )
);
