import { clientApi } from "@/apis/fetcher";
import { SCHEDULE_CACHE_TIME, SCROLL_PER_YOUTUBE_CARD } from "@/constants";
import { SCHEDULES_TAG } from "@/constants/revalidate-tag";
import { useScheduleStore } from "@/stores/schedule";
import { TScheduleSelect } from "@/types";
import { TGetScheduleResponse } from "@/types/api/schedule";
import {
  TChannelDocumentWithoutId,
  TParsedClientContent,
  TParsedServerContent,
} from "@/types/api/was";
import { waitfor } from "@/utils/helper";
import { addEscapeCharacter, replaceParentheses } from "@/utils/regexp";
import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import dayjs from "@/libraries/dayjs";
import useCachedData from "./use-cached-data";

export function useScheduleQuery(arg: {
  /** 유저설정과 관계없이 페이지별로 설정옵션 */
  enableAutoSync: boolean;
  // locale: TLocaleCode;
}) {
  const { isUserCacheActive, refreshInterval } = useScheduleStore(); //유저설정
  // const { t } = useTranslations();

  const userCacheTime = isUserCacheActive ? refreshInterval * 60 * 1000 : false;

  // a tag, window.location.href, window.location.reload() 등을 사용하여 페이지 이동시 캐시가 무효화됨
  const query = useQuery({
    queryKey: [SCHEDULES_TAG],
    queryFn: () =>
      clientApi
        .get<TGetScheduleResponse>("v1/schedule")
        .then((res) => res.data.data),
    staleTime: SCHEDULE_CACHE_TIME, // 페이지 이동시 SCHEDULE_CACHE_TIME 동안은 캐시를 사용, data-fetching이 발생하지 않음
    gcTime: SCHEDULE_CACHE_TIME, // stale time이 지나지 않으면 data-fetch 중에 stale된 data를 대신 보여줌, isPending과 관계가 있음
    refetchInterval: arg?.enableAutoSync ? userCacheTime : false, // 페이지내 동기화 주기, 같은 페이지내에서 주기적으로 호출
    refetchOnReconnect: isUserCacheActive,
    refetchOnWindowFocus: isUserCacheActive,
    refetchIntervalInBackground: false,
  });

  return query;
}

export const useInfiniteScheduleData = ({
  rawData,
}: {
  rawData: TParsedClientContent[];
}) => {
  const [scrollPage, setScrollPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const maxPage = Math.ceil(rawData.length / SCROLL_PER_YOUTUBE_CARD);
  const isDone = scrollPage >= maxPage;

  const handleInfinityScroll = async () => {
    if (isLoading || isDone) return;
    setIsLoading(() => true);

    await waitfor(500); // 성능 최적화를 위한 딜레이

    setScrollPage((pre) => pre + 1);
    setIsLoading(() => false);
  };

  const loadContents = useMemo(
    () => rawData.slice(0, SCROLL_PER_YOUTUBE_CARD * scrollPage),
    [rawData, scrollPage]
  );

  return {
    handleInfinityScroll,
    loadContents,
    isLoading,
  };
};

export type TProceedScheduleData = {
  content: TParsedClientContent[];
  length: {
    all: number;
    stream: number;
    video: number;
  };
};

export const useProceedScheduleData = (args: {
  scheduleRawData: TParsedServerContent[];
  channelQuery: string;
  cache: ReturnType<typeof useCachedData>;
  select: TScheduleSelect;
}) =>
  useMemo(() => {
    const yesterday = dayjs().subtract(1, "day");
    const queryString = addEscapeCharacter(args.channelQuery);
    const queryReg = new RegExp(queryString, "i");

    const scheduled: TProceedScheduleData = {
      content: [],
      length: {
        all: 0,
        stream: 0,
        video: 0,
      },
    };

    const live: TProceedScheduleData = {
      content: [],
      length: {
        all: 0,
        stream: 0,
        video: 0,
      },
    };

    const daily: TProceedScheduleData = {
      content: [],
      length: {
        all: 0,
        stream: 0,
        video: 0,
      },
    };

    const all: TProceedScheduleData = {
      content: [],
      length: {
        all: 0,
        stream: 0,
        video: 0,
      },
    };

    args.scheduleRawData.forEach((item) => {
      const channelNames =
        args.cache.channelMap[item.channelId]?.names?.join(" ") || "";

      if (!queryReg.test(channelNames)) return false;

      const inBlacklist = args.cache.blackListMap.has(item.channelId);
      const inWhitelist = args.cache.whiteListMap.has(item.channelId);

      let isPassList: boolean = true;

      if (false) {
        // isPassList = inWhitelist;
      } else {
        isPassList = !inBlacklist;
      }

      if (!isPassList) return;

      const parsedData: TParsedClientContent = {
        ...args.cache.channelMap?.[item.channelId],
        videoId: item.videoId,
        channelId: item.channelId,
        broadcastStatus: item.broadcastStatus,
        isHide: item.isHide,
        isVideo: item.isVideo,
        tag: item.tag,
        // 가공된 데이터
        title: replaceParentheses(item.title),
        viewer: Number(item.viewer),
        utcTime: dayjs(item.utcTime),
      };

      if (parsedData.isHide === true && parsedData.broadcastStatus == "NULL") {
        // 취소여부 확인
        parsedData.broadcastStatus = "FALSE";
      }

      const isScheduled =
        parsedData.broadcastStatus === "TRUE" ||
        parsedData.broadcastStatus === "NULL";
      const isLive = parsedData.broadcastStatus === "TRUE";
      const isDaily = parsedData.utcTime.isAfter(yesterday);

      const isStream = args.select === "stream" && !parsedData.isVideo;
      const isVideo = args.select === "video" && parsedData.isVideo;
      const isAll = args.select === "all";

      if (isScheduled) {
        item.isVideo ? scheduled.length.video++ : scheduled.length.stream++;
        scheduled.length.all++;

        if (isStream || isVideo || isAll) {
          scheduled.content.push(parsedData);
        }
      }

      if (isLive) {
        item.isVideo ? live.length.video++ : live.length.stream++;
        live.length.all++;

        if (isStream || isVideo || isAll) {
          live.content.push(parsedData);
        }
      }

      if (isDaily) {
        item.isVideo ? daily.length.video++ : daily.length.stream++;
        daily.length.all++;

        if (isStream || isVideo || isAll) {
          daily.content.push(parsedData);
        }
      }

      item.isVideo ? all.length.video++ : all.length.stream++;
      all.length.all++;
      all.content.push(parsedData);
    });

    return {
      scheduled,
      live,
      daily,
      all,
    };
  }, [args.scheduleRawData, args.channelQuery, args.cache]);

/** query observer가 없을때 undefined 반환 */
export const useScheduleStatus = () => {
  "use no memo";
  const queryClient = useQueryClient();
  useIsFetching({ queryKey: [SCHEDULES_TAG] }); //리랜더링용

  return queryClient.getQueryState([SCHEDULES_TAG])?.status;
};
