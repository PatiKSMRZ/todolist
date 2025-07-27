import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View, } from 'react-native';
import { RootStackParamList } from '../../types/navigation';
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
const navigation = useNavigation<NavigationProp>();

  const [tasks, setTasks] = useState<Task[]>([]); //tu jest obiekt - tablica - zbiór wszystkich zadań
  const [taskText, setTaskText] = useState('') //to jest pojedyncze zadanie
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskText, setEditingTaskText] = useState("")

  useEffect(()=>{

    const fetchTasks = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if(!token) {
          console.warn('Brak tokena!'); return;
        }

        const response = await fetch('http://192.168.8.104:4000/todos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //jeśli token wygasnie automatycznie przekieruje na stronę logowania

        if (response.status === 401) {
  // np. pokaż alert lub przenieś użytkownika do logowania
          Alert.alert("Sesja wygasła", "Zaloguj się ponownie");
         navigation.navigate('LoginScreen');
          return;
}



        console.log('Response status:', response.status)
        if(!response.ok) {
          throw new Error('Błą ponierania zadań');
        }
        const data = await response.json();

        //mapowanie danych z backendu na obietk Task
        const loadedTasks = data.map((task: any) => ({
          id: task.id.toString(),
          text: task.title,
          completed: task.completed || false,
        }));
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Błąd podcas pobeirania zadań: ', error)
      }
    };
    fetchTasks();

  }, []);


  //dodawanie zadania
  const addTask = async ()=> {

    if(editingTaskId || !taskText.trim()) return; //jeśli jest puste pole lub same spacje - nic nie dodawaj

    try {
      const token = await AsyncStorage.getItem('token');
      if(!token) {
        console.warn('Brak tokena!')
        return;
      }
      const response = await fetch('http://192.168.8.104:4000/todos', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({title: taskText})
      });
      if(!response.ok) {
        throw new Error('Błąd podczas tworzenia zadania');
      }
      const newTaskFromBackend = await response.json();

      //Backend zwraca np id, title, userId, createdAt
      const newTask = {
        id: newTaskFromBackend.id.toString(),
        text: newTaskFromBackend.title,
        completed: false,
      };

      setTasks(prevTasks => [newTask, ...prevTasks]);
      setTaskText('');
      console.log('Zadanie dodane do backend', newTask);
    } catch (error) {
      console.error('Błąd podczas dodawania zadania', error)
    }


  }

  //funcja do odhaczania zadania
const toggleTaskCompletion = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if(!token) {
      Alert.alert('Brak tokena', 'Zaloguj się ponownie');
      navigation.navigate('LoginScreen');
      return;
    }

    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;

    const updatedCompleted = !taskToToggle.completed;

    const response = await fetch(`http://192.168.8.104:4000/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: updatedCompleted }),
    });

    // <-- Dodaj poniższe linie:
    console.log('PATCH status:', response.status);
    const responseBody = await response.text();
    console.log('PATCH response body:', responseBody);


    if (response.status === 401) {
      Alert.alert('Sesja wygasła', 'Zaloguj się ponownie');
      navigation.navigate('LoginScreen');
      return;
    }

    if (!response.ok) {
      throw new Error('Błąd podczas aktualizacji statusu zadania');
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: updatedCompleted } : task
      )
    );
  } catch (error) {
    Alert.alert('Błąd', (error as Error).message);
  }
};
//funkcja do usuwania zadania 
const deleteTask = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if(!token) {
      Alert.alert('Brak tokena', 'Zaloguj się ponownie');
      navigation.navigate('LoginScreen');
      return;
    }

    const response = await fetch(`http://192.168.8.104:4000/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

       console.log('DELETE status:', response.status);
    const responseBody = await response.text();
    console.log('DELETE response body:', responseBody);

    if (response.status === 401) {
      Alert.alert('Sesja wygasła', 'Zaloguj się ponownie');
      navigation.navigate('LoginScreen');
      return;
    }

    if (!response.ok) {
      throw new Error('Błąd podczas usuwania zadania');
    }

    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  } catch (error) {
    Alert.alert('Błąd', (error as Error).message);
  }
};

//edytowanie zadania
const editTask = (id: string, currentText: string) => {
    setEditingTaskId(id);
    setEditingTaskText(currentText)

}

//funkcja do zapisywania zadania
const saveEditedTask = async () => {
  if (!editingTaskId) return;

  if (!editingTaskText.trim()) {
    Alert.alert('Błąd', 'Treść zadania nie może być pusta');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Brak tokena', 'Zaloguj się ponownie');
      navigation.navigate('LoginScreen');
      return;
    }

    const response = await fetch(`http://192.168.8.104:4000/todos/${editingTaskId}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editingTaskText }),
    });

    console.log('PATCH edit status:', response.status);

    if (response.status === 401) {
      Alert.alert('Sesja wygasła', 'Zaloguj się ponownie');
      navigation.navigate('LoginScreen');
      return;
    }

    if (!response.ok) {
      // Jeśli jest błąd, odczytaj tekst odpowiedzi (np. komunikat błędu z backendu)
      const errorText = await response.text();
      console.log('PATCH edit error response body:', errorText);
      throw new Error('Błąd podczas aktualizacji zadania');
    }

    // Jeśli odpowiedź OK, czytamy JSON tylko raz
    const updatedTask = await response.json();

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editingTaskId ? { ...task, text: editingTaskText } : task
      )
    );

    setEditingTaskId(null);
    setEditingTaskText('');
  } catch (error) {
    Alert.alert('Błąd', (error as Error).message);
  }
};
//fnc anulowanie edycji
const cancelEditing = () => {
  setEditingTaskId(null);
  setEditingTaskText('')
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
                onSubmitEditing={addTask}
             />
          <Pressable onPress={addTask}  className="bg-white rounded-lg px-6 py-3 shadow-md"  android_ripple={{ color: '#93c5fd' }}>
            <Text className="text-red-500 font-semibold text-center">Dodaj zadanie</Text>
          </Pressable>

          <FlatList className="mt-5" 
            data={tasks} 
            keyExtractor={item => item.id} 
            renderItem={({item}) => (
            <View className={`flex-row items-center justify-between mb-3 ${item.id === editingTaskId ? 'bg-yellow-100 rounded px-2 py-1' : ''}`}>
              {item.id === editingTaskId ? (
              <View className="flex-row items-center gap-2">
                <TextInput
                  value={editingTaskText}
                  onChangeText={setEditingTaskText}
                  onSubmitEditing={saveEditedTask}
                  className="bg-white px-2 py-1 rounded text-black w-48"
                  autoFocus
                 />
                 <Pressable onPress={saveEditedTask}>
                  <Text className="text-green-300 font-bold">✅</Text>
                 </Pressable>
                 <Pressable onPress={cancelEditing}>
                  <Text className="text-red-300 font-bold">❌</Text>
                 </Pressable>
                 </View>
              ) : (
                <Pressable onPress={()=>toggleTaskCompletion(item.id)}>
                  <Text className={`text-lg ${item.completed ? 'line-through text-gray-400' : 'text-white'}`} >
                    {item.text}
                  </Text>
                </Pressable>
              )}
              <View className="flex-row gap-2 ml-4">
                <Pressable onPress={() => editTask(item.id, item.text)} >
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