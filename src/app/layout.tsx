import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './home/screen';
import LiveScreen from './live/screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppTabParamList } from '@/type/navigation';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

const Tab = createBottomTabNavigator<AppTabParamList>();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    console.log('appIsReady', appIsReady);
    if (!appIsReady) {
      return setAppIsReady(() => true);
    }

    SplashScreen.hideAsync().then((result) => result);
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator initialRouteName="home">
          <Tab.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
          <Tab.Screen name="live" component={LiveScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
