import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';

export default function ProfileScreen () {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);

  //dekodowanie tokenu 
  useEffect(()=> {
    const decodeToken = async ()=> {
      const storedToken = await AsyncStorage.getItem('token');
      if(storedToken){
        const decoded: any = jwtDecode(storedToken);
        console.log('Zdekowany token', decoded);
        setEmail(decoded.email);
      }
    }; decodeToken();
  }, []);

  //sprawdzanie tokenu
  useEffect(()=> {
    const showToken = async ()=> {
      const token = await AsyncStorage.getItem('token');
      console.log('Zapisany token JWT: ', token);
    };
    showToken();
  }, []);

  useEffect(()=> {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if(!storedToken) {
        router.replace('/login');
      } else {
        setToken(storedToken);
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const handleLogOut = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/welcome');
  };

  if(loading) {
    return(
      <View className="flex-1 justify-center items-center" >
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
   <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-2">Profile</Text>
      <Text className="text-lg text-green-600">Jesteś zalogowany. Hura! SUKCES !!</Text>
      <Text className="mb-2">Jesteśz zalogowany jako: {email}</Text>
      <Button title="Wyloguj się" onPress={handleLogOut}></Button>
  </View>
  );
}

