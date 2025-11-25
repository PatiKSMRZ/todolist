import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../src/firebaseConfig';

export default function LoginScreen()  {

  const router= useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    if(!email || !password) {
      Alert.alert('Błąd', 'Wszystkie pola są wymagane');
      return
    }

    try {
       const user = await auth().signInWithEmailAndPassword(email, password);

      
    Alert.alert('Sukces', `Zalogowano jako: ${user.user.email}`);
    router.replace('/');
    } catch (error: any) {
       console.log("FIREBASE ERROR:", error.code, error.message);
       let message = 'Coś poszło nie tak';
    if (error.code === 'auth/user-not-found') message = 'Nie ma takiego użytkownika';
    if (error.code === 'auth/wrong-password') message = 'Niepoprawne hasło';
     if (error.code === 'auth/invalid-credential') message = 'Niepoprawny email lub hasło'; // <-- nowy kod
    Alert.alert('Błąd logowania', message);
    console.log(error);

    }
 
  }


   return (
<KeyboardAvoidingView
  className="flex-1"
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 p-6">

      {/* Card */}
      <BlurView intensity={80} tint="light" className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white/10">
        <Text className="text-2xl font-bold text-beige mb-6 text-center">Zaloguj się</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
          className="bg-white/20 text-black p-4 rounded-xl mb-4"
        />

        <TextInput
          placeholder="Hasło"
          placeholderTextColor="#000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="bg-white/20 text-black p-4 rounded-xl mb-6"
        />

        {/* Beżowy przycisk z cieniem */}
        <TouchableOpacity
          onPress={handleLogin}
          className="rounded-xl py-4"
          style={{
            backgroundColor: '#bfa786', // beż/brąz
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5, // Android
          }}
        >
          <Text className="text-white font-bold text-center text-lg">Zaloguj się</Text>
        </TouchableOpacity>
      </BlurView>

    </View>
  </ScrollView>
</KeyboardAvoidingView>
  )
}
