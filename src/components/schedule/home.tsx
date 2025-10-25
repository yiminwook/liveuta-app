import { TParsedClientContent } from "@/types/mongodb";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ListItem from "./list-item";
import { useRef, useState } from "react";
import { useScrollToTop } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { SCHEDULES_TAG } from "@/constants/revalidate-tag";

type Props = {
  data: TParsedClientContent[];
};

export default function ScheduleHome({ data }: Props) {
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef<FlatList>(null);

  const handleRefresh = async () => {
    setRefreshing(() => true);
    await queryClient.invalidateQueries({ queryKey: [SCHEDULES_TAG] });
    setRefreshing(() => false);
  };

  useScrollToTop(listRef);

  return (
    <FlatList
      ref={listRef}
      data={data}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      keyExtractor={(item, index) => `${item.videoId}-${index}`}
      renderItem={({ item }: { item: TParsedClientContent }) => (
        <ListItem item={item} />
      )}
      // onEndReached={handleInfinityScroll}
      // onEndReachedThreshold={0.5}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardDismissMode="on-drag"
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>조회된 스케줄이 없습니다</Text>
        </View>
      )}
      // ListFooterComponent={() => (
      //   <View>
      //     {isLoadingScroll && <ActivityIndicator size="large" color="#fff" />}
      //   </View>
      // )}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
});
