import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import image from '@/assets/images/icon-512-512.png';

export default function HomeScreen() {
  const handlePress = () => {};

  return (
    <SafeAreaView>
      <Pressable onPress={handlePress}>
        <ImageBackground
          source={image}
          style={{
            width: 200,
            height: 200,
          }}
        />
        <Text>to live</Text>
      </Pressable>
    </SafeAreaView>
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
