"use client";
import { wasApi } from "@/apis/fetcher";
import {
  BLACKLIST_TAG,
  CHANNELS_TAG,
  WHITELIST_TAG,
} from "@/constants/revalidate-tag";
import { TGetChannelRes } from "@/types/api/was";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type LayoutDataObserverProps = {
  session: null;
};

export const useChannelList = () => {
  return useQuery({
    queryKey: [CHANNELS_TAG],
    queryFn: () =>
      wasApi.get<TGetChannelRes>("v1/channel").then((res) => res.data.data),
    gcTime: Infinity,
  });
};

const useCachedData = ({ session }: LayoutDataObserverProps) => {
  const [channelList, blacklist, whitelist] = useQueries({
    queries: [
      {
        queryKey: [CHANNELS_TAG],
        queryFn: () =>
          wasApi.get<TGetChannelRes>("v1/channel").then((res) => res.data.data),
        gcTime: Infinity,
      },
      {
        queryKey: [BLACKLIST_TAG],
        queryFn: () =>
          wasApi
            .get<{ message: string; data: string[] }>("v1/blacklist")
            .then((res) => res.data.data),
        enabled: !!session,
        gcTime: Infinity,
      },
      {
        queryKey: [WHITELIST_TAG],
        queryFn: () =>
          wasApi
            .get<{ message: string; data: string[] }>("v1/whitelist")
            .then((res) => res.data.data),
        enabled: !!session,
        gcTime: Infinity,
      },
    ],
  });

  const channelMap = useMemo(() => {
    if (!channelList.data) return {};
    const channelData = Object.fromEntries(
      channelList.data.map((channel) => {
        return [channel.channel_id, channel];
      })
    );
    return channelData;
  }, [channelList.data]);

  const blackListMap = useMemo(() => {
    return new Set(blacklist.data);
  }, [blacklist.data]);

  const whiteListMap = useMemo(() => {
    return new Set(whitelist.data);
  }, [whitelist.data]);

  return {
    channelMap,
    blackListMap,
    whiteListMap,
  };
};

export default useCachedData;
