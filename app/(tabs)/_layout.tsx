import { Tabs } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'

const TabIcon = ({focused, title}: any) => {
    if (focused) {return (
        <Text className='font-bold'>{title}</Text>
    )} return (<Text className='font-light'>{title}</Text>)
}

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
        name ='index'
        options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} title="home" />
            )}} 
        />
              <Tabs.Screen
        name ='help'
        options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} title="help" />
            )}} 
        />
              <Tabs.Screen
        name ='profile'
        options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} title="profile" />
            )}} 
        />
    </Tabs>
  )
}

export default _layout