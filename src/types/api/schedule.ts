import { TParsedServerContent } from "@/types/mongodb";

export type TGetScheduleResponse = {
  message: string;
  data: TParsedServerContent[];
};
