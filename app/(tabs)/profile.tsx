import React from 'react'
import { Text, View } from 'react-native'

const profile = () => {
  return (
   <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-2">Profile</Text>
      <Text className="text-lg text-green-600">Jesteś zalogowany. Hura! SUKCES !!</Text>
  </View>
  )
}

export default profile