import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { auth } from '../../src/firebaseConfig';

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // ⬅️ do przekierowania po rejestracji

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Błąd", "Wszystkie pola są wymagane");
      return;
    }

    try {
      // 🔹 Tworzenie użytkownika w Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 🔹 Aktualizacja profilu (dodanie imienia)
      await updateProfile(userCredential.user, { displayName: name });

      Alert.alert("Sukces", `Witaj, ${name}! Twoje konto zostało utworzone 🎉`);

      // 🔹 Wyczyszczenie pól
      setName("");
      setEmail("");
      setPassword("");

      // 🔹 Przekierowanie do aplikacji (np. zakładki głównej)
      router.replace("/(tabs)"); // lub router.push("/(tabs)")
    } catch (error: any) {
      let message = "Coś poszło nie tak";
      if (error.code === "auth/email-already-in-use") message = "Ten email jest już zajęty";
      if (error.code === "auth/invalid-email") message = "Nieprawidłowy email";
      if (error.code === "auth/weak-password") message = "Hasło jest za słabe";
      Alert.alert("Błąd", message);
      console.log(error);
    }
  };

  return (
 <View className="flex-1 justify-center px-6" style={{ backgroundColor: '#f5f0e6' }}>
  <Text className="text-xl font-bold mb-4 text-gray-800 text-center">
    Zarejestruj się
  </Text>

  {/* TextInput w jasnym beżu */}
  <TextInput
    placeholder="Imię"
    value={name}
    onChangeText={setName}
    placeholderTextColor="#a89f8c"
    className="p-3 mb-3 rounded-lg text-gray-800"
    style={{ backgroundColor: '#e6dfd0' }}
  />

  <TextInput
    placeholder="Email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    placeholderTextColor="#a89f8c"
    className="p-3 mb-3 rounded-lg text-gray-800"
    style={{ backgroundColor: '#e6dfd0' }}
  />

  <TextInput
    placeholder="Hasło"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
    placeholderTextColor="#a89f8c"
    className="p-3 mb-5 rounded-lg text-gray-800"
    style={{ backgroundColor: '#e6dfd0' }}
  />

  {/* Beżowy przycisk z cieniem */}
  <Pressable
    onPress={handleSubmit}
    className="p-3 rounded-lg items-center"
    style={{
      backgroundColor: '#bfa786', // beż/brąz
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // Android
    }}
  >
    <Text className="font-bold text-white">Zarejestruj się</Text>
  </Pressable>
</View>
  );
}
