import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
export default function WelcomeScreen() {

  const router = useRouter();
  return (
    <View  className="flex-1 justify-center items-center bg-red-500"  >
      <Text className="text-white text-xl font-bold">Witaj w aplikacji!</Text>
      <Text className="text-white text-xl font-bold">Co dzisiaj zamierzasz odhaczyć?</Text>
      <Pressable  onPress={() => router.push('/(auth)/login')}
          className=" p-3 rounded-lg items-center bg-[#fff8f9] ">
          <Text className="font-bold text-[#8d091f]">Zaloguj się</Text>
      </Pressable>
      <View className="h-4" />
      <Pressable onPress={() => router.push('/(auth)/register')}
          className=" p-3 rounded-lg items-center bg-[#fff8f9] ">
          <Text className="font-bold text-[#8d091f]">Zarejestruj się</Text>
      </Pressable>
    </View>
  );
}
