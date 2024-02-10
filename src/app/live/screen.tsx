import { AppTabParamList } from '@/type/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = NativeStackScreenProps<AppTabParamList, 'live'>;
export default function LiveScreen({ navigation }: ScreenProps) {
  const handlePress = () => {
    navigation.navigate('home');
  };

  return (
    <SafeAreaView>
      <Pressable onPress={handlePress}>
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
