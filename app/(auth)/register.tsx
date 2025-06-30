import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 justify-center px-6 bg-[#c3979f]">
      <Text className='text-xl font-bold mb-4'>Zarejestruj się - wpisz swoje dane</Text>
        <TextInput
          placeholder='imię'
          value={name}
          onChangeText={setName}
          className="bg-white p-2 mb-2"
        />
        <TextInput
          placeholder='email'
          value={email}
          onChangeText={setEmail}
          className="bg-white p-2 mb-2"
        />
        <TextInput
          placeholder='hasło'
          value={password}
          onChangeText={setPassword}
          className="bg-white p-2 mb-2"
          secureTextEntry
        />
    </View>
  );
}

