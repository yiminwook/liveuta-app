import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Linking, StyleSheet, View } from "react-native";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Asset } from "expo-asset";
import * as SecureStore from "expo-secure-store";
import { useSession } from "@/stores/session";

export function AnimatedSplashScreen({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;

  const actions = useSession((state) => state.actions);
  // const { updateUser } = useContext(AuthContext);

  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();
  console.log("currentlyRunning", currentlyRunning);
  console.log("isUpdateAvailable", isUpdateAvailable);
  console.log("isUpdatePending", isUpdatePending);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  async function onFetchUpdateAsync() {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert("Update available", "Please update your app", [
            {
              text: "Update",
              onPress: () => Updates.reloadAsync(),
            },
            { text: "Cancel", style: "cancel" },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  const onImageLoaded = async () => {
    try {
      // 데이터 준비
      await Promise.all([onFetchUpdateAsync()]);

      await SplashScreen.hideAsync();

      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        return Linking.openSettings();
      }
      // const token = await Notifications.getExpoPushTokenAsync({
      //   projectId:
      //     Constants?.expoConfig?.extra?.eas?.projectId ??
      //     Constants?.easConfig?.projectId,
      // });
      // console.log("token", token);
      // TODO: save token to server
    } catch (e) {
      console.error(e);
    } finally {
      setAppReady(true);
    }
  };

  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                Constants.expoConfig?.splash?.backgroundColor || "#ffffff",
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            source={image}
            style={{
              resizeMode: "contain",
              width: 200,
              transform: [{ scale: animation }, { rotate: rotateValue }],
            }}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

export function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  // const [user, setUser] = useState<User | null>(null);
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      setSplashReady(true);
    }
    prepare();
  }, [image]);

  const login = () => {
    console.log("login");
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "1234",
        password: "1234",
      }),
    })
      .then((res) => {
        console.log("res", res, res.status);
        if (res.status >= 400) {
          return Alert.alert("Error", "Invalid credentials");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
        // setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync("accessToken", data.accessToken),
          SecureStore.setItemAsync("refreshToken", data.refreshToken),
          AsyncStorage.setItem("user", JSON.stringify(data.user)),
        ]);
      })
      .catch(console.error);
  };

  const logout = () => {
    // setUser(null);
    return Promise.all([
      SecureStore.deleteItemAsync("accessToken"),
      SecureStore.deleteItemAsync("refreshToken"),
      AsyncStorage.removeItem("user"),
    ]);
  };

  const updateUser = (user: null) => {
    // setUser(user);
    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  };

  if (!isSplashReady) {
    return null;
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}
