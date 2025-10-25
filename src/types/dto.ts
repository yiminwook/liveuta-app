import { z } from "zod";
import { StreamFilter } from ".";

export type TScheduleDto = z.infer<typeof scheduleDto>;
export const scheduleDto = z.object({
  query: z
    .string()
    .nullish()
    .transform((v) => v || ""),
  filter: z
    .enum(StreamFilter)
    .nullish()
    .transform((v) => v || StreamFilter.scheduled),
  select: z
    .enum(["all", "video", "stream"])
    .nullish()
    .transform((v) => v || "all"),
  isFavorite: z
    .string()
    .nullish()
    .transform((v) => v === "true"),
});
