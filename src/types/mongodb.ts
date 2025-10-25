export type TStream = "TRUE" | "NULL" | "FALSE";

export const STREAM_STATUS_MAPPER = {
  TRUE: "stream",
  FALSE: "closed",
  NULL: "scheduled",
} as const;
