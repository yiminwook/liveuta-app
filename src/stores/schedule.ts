import { SCHEDULE_STORAGE_KEY } from "@/constants/storage-key";
import { TScheduleSelect } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const REFRESH_INTERVAL = [3, 5, 10, 15, 30, 60] as const;

export type TScheduleState = {
  isActive: boolean;
  refreshInterval: number;
  select: TScheduleSelect;
};

export type TScheduleAction = {
  setIsActive: (isActive: boolean) => void;
  setRefreshInterval: (
    refreshInterval: (typeof REFRESH_INTERVAL)[number]
  ) => void;
  setSelect: (select: TScheduleSelect) => void;
};

export type TScheduleStore = TScheduleState & { actions: TScheduleAction };

export const useScheduleStore = create<TScheduleStore>()(
  persist(
    (set) => ({
      isActive: true,
      refreshInterval: 3,
      select: "all",
      actions: {
        setIsActive: (isActive) => set({ isActive }),
        setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
        setSelect: (select) => set({ select }),
      },
    }),
    {
      name: SCHEDULE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => ({
        isActive: state.isActive,
        refreshInterval: state.refreshInterval,
        select: state.select,
      }),
    }
  )
);
