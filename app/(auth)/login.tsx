import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

export default function LoginScreen()  {

  const router= useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.8.109:4000/login', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({email, password}),
      });
      const data = await response.json();
      console.log('Odp backendu', data)

      if (response.ok && data.token) {
        //zapisz token
        await AsyncStorage.setItem('token', data.token)

        // zapisz dane użytkownika (id, email itd)
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        Alert.alert('Sukces', 'Zalogowano pomyślnie');
              console.log(data.token); // tutaj masz JWT

        //przejdź na ekran profilu
        router.replace('/profile');
      } else {
        Alert.alert('Błąd logowanie', data.error);
      }
    } catch(error) {
      Alert.alert('Błąd połączenia', 'Nie udało się połączyć z serwerem.');
      console.log(error);
    }
  }


  return (
    <View className="flex-1 justify-center px-6 bg-[#c3979f]" >
      <Text className="text-xl font-bold mb-4">Zaloguj się</Text>
       <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="bg-white p-2 mb-2"
      />

      <TextInput
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-white p-2 mb-4"
      />
      
      <Button title="Zaloguj się" onPress={handleLogin} />

    </View>
  )
}
