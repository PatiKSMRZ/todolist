import { Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View  className="flex-1 justify-center items-center bg-red-500"  >
      <Text className="text-white text-xl font-bold">Witaj w aplikacji!</Text>
      <Text className="text-white text-xl font-bold">Co dzisiaj zamierzawsz odhaczyć?</Text>
    </View>
  );
}
