import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
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
  }, [router]);

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
 <View className="flex-1 justify-center items-center bg-white p-6">
  <Text className="text-xl font-bold mb-2 text-gray-800">Profil</Text>
  <Text className="text-lg text-green-600 mb-2">Jesteś zalogowany!</Text>
  <Text className="mb-4 text-gray-700">Email: {email}</Text>

  {/* Beżowy przycisk wylogowania */}
  <TouchableOpacity
    onPress={handleLogOut}
    className="rounded-xl py-4 px-8"
    style={{
      backgroundColor: '#bfa786', // beż/brąz
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // Android
    }}
  >
    <Text className="text-white font-bold text-center text-lg">Wyloguj się</Text>
  </TouchableOpacity>
</View>
  );
}