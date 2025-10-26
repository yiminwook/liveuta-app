import { TParsedServerContent } from "@/types/api/was";

export type TGetScheduleResponse = {
  message: string;
  data: TParsedServerContent[];
};
