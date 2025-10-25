export type Entity = [string, string][];

export const SCHEDULE_SELECT_TP: Entity = [
  ["all", "전체"],
  ["stream", "라이브"],
  ["video", "영상"],
];

export const findEntity = (entity: Entity, value: string) => {
  const found = entity.find(([tp, text]) => tp === value || text === value);
  if (!found) return null;
  return { key: found[0], value: found[1] };
};
