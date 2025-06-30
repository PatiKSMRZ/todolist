import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

export default function LoginScreen()  {

  const router= useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


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

    </View>
  )
}
