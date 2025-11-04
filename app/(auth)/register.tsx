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
    <View className="flex-1 justify-center px-6 bg-[#c3979f]">
      <Text className="text-xl font-bold mb-4 text-white text-center">
        Zarejestruj się
      </Text>

      <TextInput
        placeholder="Imię"
        value={name}
        onChangeText={setName}
        className="bg-white p-3 mb-3 rounded-lg"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="bg-white p-3 mb-3 rounded-lg"
      />

      <TextInput
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-white p-3 mb-5 rounded-lg"
      />

      <Pressable
        onPress={handleSubmit}
        className="p-3 rounded-lg items-center bg-[#fff8f9]"
      >
        <Text className="font-bold text-[#8d091f]">Zarejestruj się</Text>
      </Pressable>
    </View>
  );
}
