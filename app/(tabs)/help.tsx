/*import { FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import React, { ReactNode, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Welcome = ({pet, guest} : {pet: string, guest: null | string | undefined}) => {
 // return <Text>{typeof guest === "string" ? `Witaj, ${pet}` : `Witaj, gościu`}</Text>;
 return <Text>{ guest  ? `Witaj, ${pet}` : `Witaj, gościu`}</Text>;
};
const Separator = () => {
  return <View style={styles.separator} />;
};

const AppHeader = () => {
  return (
  <View>
    <Text style={styles.title}>Moja aplikacja</Text>
  </View>
  )
}

const Message = ({text} : {text: string}) => {
  return <Text>To jest nowa wiadomość: {text}</Text>

}

const Title = ({title} : {title: string}) => {
  return (
    <View className="flex-1 bg-gradient-to-r from-purple-900 via-indigo-900 to-black justify-center items-center">
      <Text
        className="text-4xl font-extrabold text-center tracking-widest text-white"
        style={{
          textShadowColor: '#9de0ff',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 12,
          shadowColor: '#6fc2ff',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 15,
          elevation: 25,
        }}
      >
        ✨ {title.toUpperCase()} ✨
      </Text>
    </View>
  );
}

const Greeting =({name, age} : {name: string; age: number}) => {
  return(
    <Text>Jestem {name} i mam {age} lat</Text>
  )
}

const ErrorMessage = ({text} : {text: string}) => {
  return (
    <Text className='text-red-500 text-xl font-semibold font-extrabold text-center'>{text}</Text>
  )
}

const BlinkingText = ({text}: {text: string }) => {
  const [visible, setVisible] = useState(true);

  useEffect(()=> {
    const interval = setInterval(()=> {
      setVisible((prev) => !prev);
    }, 500);
    return ()=> clearInterval(interval)
  }, []);

  return (
   <View className="items-center justify-center">
      {visible && (
        <Text className="text-red-500 text-xl font-bold">
          {text}
        </Text>
      )}
    </View>
  )
}

const ColoredBox = ({color} : {color: string}) => {
  return (
    <View style={{backgroundColor: color, width:100, height: 100}}></View>

  )
}

interface ColoredBoxProps {
  color: string;
}

const ColoredBoxClass = ({color}: ColoredBoxProps) => {
  return (
     <View className={`${color} w-24 h-24 rounded-xl shadow-md`} />
  )
}

interface BigTextProps {
  text: string;
  fontSize: number;
}

const BigText =({text, fontSize}: BigTextProps) =>{
  return(
    <Text className="font-bold text-center text-black" style={{fontSize}}> {text}</Text>
  )
}

interface CardProps {
  children: ReactNode;
}
const Card = ({children} : CardProps) => {

  return (
    <View className="bg-white p-4 rounded-xl shadow-md"> {children}</View>
  )

}

interface ProfileImageProps{
  src: string | number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({src}) => {
  const imageSource = typeof src === 'string' ? {uri: src} : src;
  return (
    <Image
      source={imageSource}
      style={stylesImage.image}
      resizeMode="cover"
    />
  )
};
const stylesImage = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },})
type IconName = React.ComponentProps<typeof FontAwesome>['name'];

  interface UserLabelProps {
    username: string;
    iconName: IconName;
  }

  const UserLabel: React.FC<UserLabelProps> = ({username,iconName})=> (
    <View style={stylesIcon.container}>
      <FontAwesome name={iconName} size={20} color="black" style={stylesIcon.icon} />
    <Text style={stylesIcon.username}>{username}</Text>
    </View>
  );
  const stylesIcon = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 8 },
  username: { fontSize: 16 },
});

//sredniozaawansowane
const StatusIndicator = ({isOnline, user} : {isOnline: boolean, user: string}) => {
  return(
  <View className="flex-row items-center space-x-2">
    <Text className="text-base">{user}</Text>
    <Icon name="circle"
          color={isOnline  ? 'green' : 'gray'}
          />
  </View>
  )
}

const Avatar =({src} : {src: string | number | null | undefined })=>{

  const isEmpty = !src || (typeof src === 'string' && src.trim() ==='');


   const imageSRC = isEmpty
   ? require('../../assets/images/avatar1.jpg')
   : typeof src === 'string'
   ? {uri: src}
   : src;
  return(
    <View >
      <Image
        source={imageSRC}
        style={stylesImage.image}
        resizeMode="cover" // lub 'cover' jeśli chcesz wypełnienie
      />
    </View>
  )
}

const Notification= ({message,message2, isError} : {message: string,message2: string, isError: boolean }) => {

   // if(isError === true) {
   //   return (
 //      <Text>to jest {message}</Text>
 //     )
 //   } else {
 //     return (
 //       <Text>no {message2}</Text>
 //     )
 //   }

 return (
  <Text className={isError ? 'text-red-500' : 'text-green-500'}>{isError ? `To jest ${message}` : `no ${message2}`}</Text>
 )
 
}

const UserBadge = ({role} : {role: string}) => {
  return(
    <Text className="px-2 py-1 rounded-full text-xs font-semibold" >{role === "admin" ? "zalogowany jako admin" : "zalogowany jako user"}</Text>
  )
} 

export default function Help ()  {

  const currentData = new Date();
  const libDate = format(new Date(), 'dd.MM.yyyy', { locale: pl})

  const formattedDate = `${currentData.getDate().toString().padStart(2, '0')}-${(currentData.getMonth() + 1).toString().padStart(2, '0')}-${currentData.getFullYear()}`;
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <AppHeader/>
      <Text>help</Text>
      <Title title="nagłówek"/>
      <Welcome pet="Toem" guest={null}/>
      <Text>Patrycja</Text>
      <Text>Dzisiejsza data: {formattedDate}</Text>
      <Separator/>
      <Text>dzisiejsza data: {libDate}</Text>
      <Separator/>
      <Message text="o tam slycahc, blah blah balh"/>
      <Greeting name="Ania" age={25}/>
      <ErrorMessage text="brak połączenia" />
      <ColoredBox color="blue"/>
      <ColoredBoxClass  color='bg-green-300'/>
      <BigText  fontSize={28} text='blah ljsd'/>
      <Card> 
        <Text className="text-lg font-semibold">Tytuł produktu</Text>
        <Text className="text-gray-600">Cena: 49 zł</Text>
      </Card>
      <Separator />
      <Card>
        <Text>co to jest </Text>
      </Card>
      <ProfileImage src={require('../../assets/images/miami.jpg')} />
      <ProfileImage src={require('../../assets/images/panda.jpg')}/>
      <UserLabel username='tommy' iconName='user' />
      <UserLabel username="guest" iconName="eye" />
      <StatusIndicator user="Matt" isOnline={true} />
      <StatusIndicator user="patison" isOnline={true} />
      <Avatar src={null} />
      <Avatar src={require('../../assets/images/panda.jpg')} />
      <Notification isError={true} message='eror' message2='errere' />
      <UserBadge role="user"/> */
    import React from 'react'
import { Text, View } from 'react-native'

{ /* <BlinkingText text="Uwaga"/> 
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CCCCCC',
    marginVertical: 10,
  },
    title: {
    fontSize: 24,       // ← większy font
    fontWeight: 'bold', // ← pogrubienie
    color: '#333333',
  },
});
*/}

const help = () => {
  return (
    <View>
      <Text>help</Text>
    </View>
  )
}

export default help