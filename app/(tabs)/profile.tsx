import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { auth } from '../../src/firebaseConfig';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  // Nasłuchiwanie stanu użytkownika
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || '');
      } else {
        router.replace('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup przy unmount
  }, []);

  // Wylogowanie
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.replace('/welcome');
    } catch (error) {
      console.log('Błąd przy wylogowaniu:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-2">Profil</Text>
      <Text className="text-lg text-green-600 mb-2">Jesteś zalogowany!</Text>
      <Text className="mb-4">Email: {email}</Text>
      <Button title="Wyloguj się" onPress={handleLogOut} />
    </View>
  );
}