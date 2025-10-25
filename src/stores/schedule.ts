import { SCHEDULE_STORAGE_KEY } from "@/constants/storage-key";
import { TScheduleSelect } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const REFRESH_INTERVAL = [3, 5, 10, 15, 30, 60] as const;

export type TScheduleState = {
  isUserCacheActive: boolean;
  refreshInterval: number;
  select: TScheduleSelect;
  lastTabPage: number;
};

export type TScheduleAction = {
  setIsActive: (isActive: boolean) => void;
  setRefreshInterval: (
    refreshInterval: (typeof REFRESH_INTERVAL)[number]
  ) => void;
  setSelect: (select: TScheduleSelect) => void;
  setLastTabPage: (lastTabPage: number) => void;
};

export type TScheduleStore = TScheduleState & { actions: TScheduleAction };

export const useScheduleStore = create<TScheduleStore>()(
  persist(
    (set) => ({
      isUserCacheActive: true,
      refreshInterval: 3,
      select: "all",
      lastTabPage: 0,
      actions: {
        setIsActive: (isUserCacheActive) => set({ isUserCacheActive }),
        setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
        setSelect: (select) => set({ select }),
        setLastTabPage: (lastTabPage: number) => set({ lastTabPage }),
      },
    }),
    {
      name: SCHEDULE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({
        isActive: state.isUserCacheActive,
        refreshInterval: state.refreshInterval,
        select: state.select,
        lastTabPage: state.lastTabPage,
      }),
    }
  )
);
