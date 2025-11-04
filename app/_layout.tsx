import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { auth } from "../src/firebaseConfig";
import './globals.css';

export default function RootLayout() {
  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("✅ Firebase Auth startuje...");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👤 Użytkownik:", user ? user.email : "brak zalogowanego");
      setIsLoggedIn(!!user);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text>Ładowanie...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name={isLoggedIn ? "(tabs)" : "welcome"}
        options={{ headerShown: false }}
      />
    </Stack>
  );
}