export type TChannelDocument = {
  _id?: string;
  channel_id: string;
  name_kor: string;
  names: string[];
  channel_addr: string;
  handle_name: string;
  createdAt: string;
  waiting: boolean;
  alive: boolean;
  profile_picture_url: string;
};

export type TChannelDocumentWithoutId = Omit<TChannelDocument, "_id">;
export type WaitingListItem = Pick<
  TChannelDocument,
  "channel_addr" | "name_kor"
>;
export type TChannelRecord = Record<string, TChannelDocumentWithoutId>;

export type TGetChannelRes = {
  message: string;
  data: TChannelDocumentWithoutId[];
};

export type TSetlist = {
  videoId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  broadcastAt: string;
  title: string;
  channelId: string;
  email: string;
};
