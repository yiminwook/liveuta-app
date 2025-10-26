import { TChannelDocumentWithoutId } from "@/types/api/was";
import { useScrollToTop } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ChannelListItem from "./list-item";

type Props = {
  channelList: TChannelDocumentWithoutId[];
};

export default function ChannelList({ channelList }: Props) {
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef<FlatList>(null);

  // 데이터 절약을 위해서 막아둠
  // const handleRefresh = async () => {
  //   setRefreshing(() => true);
  //   await queryClient.invalidateQueries({ queryKey: [CHANNELS_TAG] });
  //   setRefreshing(() => false);
  // };

  useScrollToTop(listRef);

  return (
    <FlatList
      ref={listRef}
      data={channelList}
      refreshing={refreshing}
      // onRefresh={handleRefresh}
      keyExtractor={(item, index) => `${item.channel_id}-${index}`}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      renderItem={({ item }: { item: TChannelDocumentWithoutId }) => (
        <ChannelListItem item={item} />
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
      //     {isLoadingScroll && <ActivityIndicator size="large" color={TINT_COLOR} />}
      //   </View>
      // )}
    />
  );
}

const styles = StyleSheet.create({
  itemSeparator: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
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
