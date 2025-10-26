import ChannelList from "@/components/channel/list";
import ChannelSearchModal from "@/components/channel/search-modal";
import ChannelSearchNav from "@/components/channel/search-nav";
import { SHEET_COLOR, TINT_COLOR } from "@/constants/theme";
import { useChannelList } from "@/hooks/api/use-cached-data";
import { addEscapeCharacter } from "@/utils/regexp";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChannelScreen() {
  const [channelQuery, setChannelQuery] = useState("");
  const [isShowSearchModal, setIsShowSearchModal] = useState(false);

  const channelList = useChannelList();

  const onChangeQuery = (query: string) => setChannelQuery(() => query);

  const openSearchModal = () => setIsShowSearchModal(() => true);
  const closeSearchModal = () => setIsShowSearchModal(() => false);

  const filteredChannelList = useMemo(() => {
    const queryString = addEscapeCharacter(channelQuery);
    const reg = new RegExp(queryString, "i");

    return (
      channelList.data?.filter((item) => {
        const channelNames = item.names?.join(" ") || "";
        return reg.test(channelNames);
      }) || []
    );
  }, [channelQuery]);

  if (channelList.isPending) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={TINT_COLOR} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ChannelSearchNav
          query={channelQuery}
          length={channelList.data?.length ?? 0}
          openSearchModal={openSearchModal}
        />
        <ChannelList channelList={filteredChannelList} />
      </SafeAreaView>

      {isShowSearchModal && (
        <ChannelSearchModal
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
    flex: 1,
    backgroundColor: SHEET_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: SHEET_COLOR,
  },
});
