import { AppTabParamList } from '@/type/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import image from '@/assets/icon-512-512.png';

type ScreenProps = NativeStackScreenProps<AppTabParamList, 'home'>;
export default function HomeScreen({ navigation }: ScreenProps) {
  const handlePress = () => {
    navigation.navigate('live');
  };

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
