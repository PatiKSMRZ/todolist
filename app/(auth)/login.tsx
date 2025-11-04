import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password) ;
      const user = userCredential.user;

      
    Alert.alert('Sukces', `Zalogowano jako: ${user.email}`);
    router.replace('/');
    } catch (error: any) {
       let message = 'Coś poszło nie tak';
    if (error.code === 'auth/user-not-found') message = 'Nie ma takiego użytkownika';
    if (error.code === 'auth/wrong-password') message = 'Niepoprawne hasło';
    Alert.alert('Błąd logowania', message);
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
