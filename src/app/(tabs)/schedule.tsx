import ScheduleList from "@/components/schedule/list";
import SearchNav from "@/components/schedule/search-nav";
import SearchModal from "@/components/schedule/search-modal";
import SegmentControl from "@/components/schedule/segment-control";
import { SHEET_COLOR } from "@/constants/theme";
import useCachedData from "@/hooks/api/use-cached-data";
import {
  useProceedScheduleData,
  useScheduleQuery,
} from "@/hooks/api/use-schedule";
import { useScheduleStore } from "@/stores/schedule";
import { StreamFilter } from "@/types";
import { useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import { DirectEventHandler } from "react-native/Libraries/Types/CodegenTypes";
import { OnPageSelectedEventData } from "react-native-pager-view/lib/typescript/PagerViewNativeComponent";

export default function ScheduleScreen() {
  const [channelQuery, setChannelQuery] = useState("");
  const [isShowSearchModal, setIsShowSearchModal] = useState(false);

  const pageViewRef = useRef<PagerView>(null);

  const schedule = useScheduleQuery({ enableAutoSync: true });
  const cache = useCachedData({ session: null });
  const scheduleStore = useScheduleStore();

  const proceedScheduleData = useProceedScheduleData({
    cache,
    scheduleRawData: schedule.data || [],
    channelQuery,
    select: scheduleStore.select,
  });

  const onChangeQuery = (query: string) => setChannelQuery(() => query);

  const openSearchModal = () => setIsShowSearchModal(() => true);
  const closeSearchModal = () => setIsShowSearchModal(() => false);

  const movePage = (position: number) => {
    pageViewRef.current?.setPage(position);
  };

  const onPageSelected: DirectEventHandler<OnPageSelectedEventData> = (
    event
  ) => {
    scheduleStore.actions.setLastTabPage(event.nativeEvent.position);
  };

  const contentLength = useMemo(() => {
    switch (scheduleStore.lastTabPage) {
      case 0:
        return proceedScheduleData.scheduled.length;
      case 1:
        return proceedScheduleData.live.length;
      case 2:
        return proceedScheduleData.daily.length;
      case 3:
        return proceedScheduleData.all.length;
      default:
        return proceedScheduleData.scheduled.length;
    }
  }, [scheduleStore.lastTabPage, proceedScheduleData]);

  if (schedule.isPending) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        <SegmentControl movePage={movePage} />
        <SearchNav
          query={channelQuery}
          contentLength={contentLength}
          openSearchModal={openSearchModal}
        />
        <PagerView
          ref={pageViewRef}
          initialPage={scheduleStore.lastTabPage}
          style={{ flex: 1 }}
          onPageSelected={onPageSelected}
        >
          <ScheduleList
            key={StreamFilter.scheduled}
            proceedScheduleData={proceedScheduleData.scheduled}
          />
          <ScheduleList
            key={StreamFilter.live}
            proceedScheduleData={proceedScheduleData.live}
          />
          <ScheduleList
            key={StreamFilter.daily}
            proceedScheduleData={proceedScheduleData.scheduled}
          />
          <ScheduleList
            key={StreamFilter.all}
            proceedScheduleData={proceedScheduleData.all}
          />
        </PagerView>
      </SafeAreaView>

      {isShowSearchModal && (
        <SearchModal
          query={channelQuery}
          contentLength={contentLength}
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
