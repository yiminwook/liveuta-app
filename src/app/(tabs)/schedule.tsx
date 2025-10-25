import ScheduleHome from "@/components/schedule/home";
import SearchNav from "@/components/schedule/search-nav";
import SearchModal from "@/components/schedule/search-modal";
import SegmentControl from "@/components/schedule/segment-control";
import { SHEET_COLOR } from "@/constants/theme";
import useCachedData from "@/hooks/api/use-cached-data";
import { useScheduleQuery } from "@/hooks/api/use-schedule";
import { useScheduleStore } from "@/stores/schedule";
import { StreamFilter } from "@/types";
import { addEscapeCharacter } from "@/utils/regexp";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleScreen() {
  const [filter, setFilter] = useState<StreamFilter>(StreamFilter.scheduled);
  const [channelQuery, setChannelQuery] = useState("");
  const [isShowSearchModal, setIsShowSearchModal] = useState(false);

  const select = useScheduleStore((state) => state.select);

  const schedule = useScheduleQuery({ filter, enableAutoSync: true });
  const cache = useCachedData({
    session: null,
  });

  const onChangeFilter = (filter: StreamFilter) => setFilter(() => filter);
  const onChangeQuery = (query: string) => setChannelQuery(() => query);

  const openSearchModal = () => setIsShowSearchModal(() => true);
  const closeSearchModal = () => setIsShowSearchModal(() => false);

  const proceedScheduleData = useMemo(() => {
    if (!schedule.data) {
      return {
        content: [],
        length: {
          all: 0,
          stream: 0,
          video: 0,
        },
      };
    }

    const queryString = addEscapeCharacter(channelQuery);
    const queryReg = new RegExp(queryString, "i");

    let allCount = 0;
    let videoCount = 0;

    const filteredContent = schedule.data.filter((content) => {
      const channelNames =
        cache.channelMap[content.channelId]?.names?.join(" ") || "";

      if (!queryReg.test(channelNames)) return false;

      const inBlacklist = cache.blackListMap.has(content.channelId);
      const inWhitelist = cache.whiteListMap.has(content.channelId);

      let isPassList: boolean = true;

      // if (scheduleDto.isFavorite) {
      //   isPassList = inWhitelist;
      // } else {
      //   isPassList = !inBlacklist;
      // }

      let isPassType: boolean;

      switch (select) {
        case "stream":
          isPassType = !content.isVideo;
          break;
        case "video":
          isPassType = content.isVideo;
          break;
        default:
          isPassType = true;
          break;
      }

      if (isPassList) allCount++;
      if (content.isVideo && isPassList) videoCount++;
      return isPassList && isPassType;
    });

    return {
      content: filteredContent,
      length: {
        all: allCount,
        stream: allCount - videoCount,
        video: videoCount,
      },
    };
  }, [schedule.data, channelQuery, select, cache]);

  if (schedule.isPending) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        <SegmentControl filter={filter} onChange={onChangeFilter} />
        <SearchNav
          query={channelQuery}
          count={proceedScheduleData.length}
          openSearchModal={openSearchModal}
        />
        <ScheduleHome data={proceedScheduleData.content ?? []} />
      </SafeAreaView>

      {isShowSearchModal && (
        <SearchModal
          query={channelQuery}
          closeSearchModal={closeSearchModal}
          onChangeQuery={onChangeQuery}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: SHEET_COLOR,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: SHEET_COLOR,
    flex: 1,
  },
});
