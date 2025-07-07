import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-xl font-bold bg-red-500">co zamierzasz dzisiaj zrealizować? 👋</Text>
      <Text>Jesteś zalogowany!</Text>
    </View>
  );
}