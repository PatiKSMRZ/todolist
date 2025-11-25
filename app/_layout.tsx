import auth from '@react-native-firebase/auth';
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import './globals.css';

export default function RootLayout() {
  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      console.log("👤 Użytkownik:", user ? user.email : "brak");
      setIsLoggedIn(!!user);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  // ⏳ Póki auth się ładuje, nie przeładowuj routingu
  useEffect(() => {
    if (!authReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/welcome");
    }

    if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [authReady, isLoggedIn, router, segments]);

  if (!authReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text>Ładowanie...</Text>
      </View>
    );
  }

  return <Slot />;
}