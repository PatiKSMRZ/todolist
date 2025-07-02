import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //funkacja - dodaj użytkownika

  const handleSubmit = async () => {

    if(!name || !email || !password) {
      Alert.alert('Błąd', 'wsystkie pola są wymagane');
      return;
    }


     //walidacja maila
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
      Alert.alert('Błąd', 'Nieprawidłowy adres email')
      return;
    }

    try {
      const reponse = await fetch('http://192.168.8.109:4000/User', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({name, email, password})
      });

      const data = await reponse.json();
      if (reponse.ok) {
        Alert.alert('Sukces', `Dodane użytkownika: ${name}`);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Błąd', data.error || 'Coś poszło nie tak');
      }
    } catch (error) {
      Alert.alert('Błąd', 'brak połączenia z serwerem');
      console.log(error);
    }
  };

 


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

             <Pressable onPress={handleSubmit} className=" p-3 rounded-lg items-center bg-[#fff8f9] ">
                  <Text className="font-bold text-[#8d091f]">Zarejestruj się</Text>
              </Pressable>
    </View>
  );
}

