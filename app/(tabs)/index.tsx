import React, { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {

  const [tasks, setTasks] = useState<Task[]>([]); //tu jest obiekt - tablica - zbiór wszystkich zadań
  const [taskText, setTaskText] = useState('') //to jest pojedyncze zadanie


  //dodawanie zadania
  const addTask = ()=> {

    if(!taskText.trim()) return; //jeśli jest puste pole lub same spacje - nic nie dodawaj

    const newTask = {id: Date.now().toString(), text: taskText, completed: false}; //tu tworzysz nowe zadanie 
    setTasks(prevTasks => [newTask, ...prevTasks ]); //tu 'wrzucasz' je do tablicy
    setTaskText('')
    console.log('Dodaję zadanie!', newTask)
  }

  //funcja do odhaczania zadania
  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task =>
        task.id === id ? {...task, completed: !task.completed } : task
      )
    )
  }
//funkcja do usuwania zadania 
const deleteTask = (id: string) => {
  setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
}

//edytowanie zadania
const editTask = (id: string) => {
  const newText = prompt('nowa treść zadania: ');
  if(newText) {
    setTasks(prevTasks => 
      prevTasks.map(task =>
        task.id === id ? {...task, text: newText} : task
      )
    )
  }
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
            <View className="flex-row items-center justify-between mb-3">
              <Pressable onPress={() => toggleTaskCompletion(item.id)} >
                <Text className={`text-lg ${item.completed ? 'line-through text-gray-400' : 'text-white'}`} >
                  {item.text}
                </Text>
              </Pressable>
              <View className="flex-row gap-2 ml-4">
                <Pressable onPress={() => editTask(item.id)} >
                  <Text  className="text-yellow-300">✏️</Text>
                </Pressable>
                <Pressable onPress={() => deleteTask(item.id)} >
                  <Text  className="text-yellow-300">🗑️</Text>
                </Pressable>
              </View>

            </View>
          )}
           ListEmptyComponent={<Text>Brak zadań</Text>}
           />

       
        </View>
    </View>
  );
}