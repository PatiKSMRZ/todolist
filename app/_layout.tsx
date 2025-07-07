import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import './globals.css';

export default function RootLayout() {

  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  //token
    useEffect(()=> {
      const checkToken = async ()=> {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token);
        setAuthReady(true);
      };
      checkToken();
    }, []);

    if(!authReady){
      return null;
    }

  return <Stack>
          <Stack.Screen 
            name={isLoggedIn ? "(tabs)" : "welcome"}
            options={{headerShown: false}}
          />

        </Stack>;
}
