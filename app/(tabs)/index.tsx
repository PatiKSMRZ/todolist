import React, { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

interface Task {
  id: string;
  text: string;
}

export default function HomeScreen() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('')

  const addTask = ()=> {

    if(!taskText.trim()) return;

    const newTask = {id: Date.now().toString(), text: taskText};
    setTasks(prevTasks => [newTask, ...prevTasks ]);
    setTaskText('')
    console.log('Dodaję zadanie!', newTask)
  }



  return (<View className="flex-1 bg-red-500 justify-center items-center px-4  pt-40">
        <View className="items-center mb-6">
          <Text className="text-xl font-bold text-white mb-2">co zamierzasz dzisiaj zrealizować? 👋</Text>
          <Text className="text-white">Jesteś zalogowany!</Text>
        </View>
        <View>

            <TextInput className="bg-white w-72 rounded-lg px-4 py-2 mb-4 text-black"
              placeholder='Wpisz zadanie...'
              placeholderTextColor="#999"
              value={taskText}
              onChangeText={setTaskText}
             />
          <Pressable onPress={addTask}  className="bg-white rounded-lg px-6 py-3 shadow-md"  android_ripple={{ color: '#93c5fd' }}>
            <Text className="text-red-500 font-semibold text-center">Dodaj zadanie</Text>
          </Pressable>

          <FlatList className="mt-5" 
            data={tasks} 
            keyExtractor={item => item.id} 
            renderItem={({item}) => (
            <Text className="text-lg mb-2">{item.text}</Text>
          )}
           ListEmptyComponent={<Text>Brak zadań</Text>}
           />

       
        </View>
    </View>
  );
}