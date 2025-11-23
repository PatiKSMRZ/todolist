import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

export default function WelcomeScreen() {

  const router = useRouter();
  return (

<KeyboardAvoidingView
  className="flex-1"
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View className="flex-1 justify-center items-center relative" style={{ backgroundColor: '#f5f0e6' }}>

      {/* Card container */}
      <View className="w-full max-w-md p-8 rounded-3xl mx-4 bg-white shadow-md">
        <Text className="text-gray-800 text-2xl font-bold mb-4 text-center">
          Witaj w aplikacji!
        </Text>
        <Text className="text-gray-700 text-lg mb-6 text-center">
          Co dzisiaj zamierzasz odhaczyć?
        </Text>

        {/* Beżowy przycisk z cieniem */}
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="rounded-xl py-4 mb-4"
          style={{
            backgroundColor: '#c8b79f', // beżowy
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5, // Android
          }}
        >
          <Text className="text-white font-bold text-center text-lg">Zaloguj się</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(auth)/register')}
          className="rounded-xl py-4"
          style={{
            backgroundColor: '#bfa786', // ciemniejszy beż/brąz
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text className="text-white font-bold text-center text-lg">Zarejestruj się</Text>
        </Pressable>
      </View>

    </View>
  </ScrollView>
</KeyboardAvoidingView>

  ); 
}
