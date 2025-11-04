import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { onAuthStateChanged } from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View, } from 'react-native';
import { auth, db } from "../../src/firebaseConfig";
import { RootStackParamList } from '../../types/navigation';




interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
  const navigation = useNavigation<NavigationProp>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // 👤 Obserwuj zalogowanego użytkownika
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        navigation.navigate('LoginScreen');
      }
    });
    return () => unsubscribe();
  }, []);

  // 📥 Pobieranie zadań w czasie rzeczywistym
  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'users', userId, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().title,
        completed: doc.data().completed,
      }));
      setTasks(userTasks);
    });
    return () => unsubscribe();
  }, [userId]);

  // ➕ Dodawanie zadania
  const addTask = async () => {
    if (!taskText.trim() || !userId) return;
    try {
      await addDoc(collection(db, 'users', userId, 'tasks'), {
        title: taskText.trim(),
        completed: false,
        createdAt: new Date(),
      });
      setTaskText('');
    } catch (e) {
      console.error('Błąd podczas dodawania zadania:', e);
      Alert.alert('Błąd', 'Nie udało się dodać zadania');
    }
  };

  // ✅ Odhaczanie zadania
  const toggleTaskCompletion = async (id: string) => {
    if (!userId) return;
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      await updateDoc(doc(db, 'users', userId, 'tasks', id), {
        completed: !task.completed,
      });
    } catch (e) {
      console.error('Błąd przy zmianie statusu:', e);
    }
  };

  // ✏️ Edycja
  const editTask = (id: string, currentText: string) => {
    setEditingTaskId(id);
    setEditingTaskText(currentText);
  };

  const saveEditedTask = async () => {
    if (!editingTaskId || !editingTaskText.trim() || !userId) return;
    try {
      await updateDoc(doc(db, 'users', userId, 'tasks', editingTaskId), {
        title: editingTaskText.trim(),
      });
      setEditingTaskId(null);
      setEditingTaskText('');
    } catch (e) {
      console.error('Błąd podczas edycji:', e);
      Alert.alert('Błąd', 'Nie udało się zaktualizować zadania');
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  // 🗑️ Usuwanie zadania
  const deleteTask = async (id: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'users', userId, 'tasks', id));
    } catch (e) {
      console.error('Błąd podczas usuwania:', e);
      Alert.alert('Błąd', 'Nie udało się usunąć zadania');
    }
  };

  // 🖼️ UI
  return (
    <View className="flex-1 bg-red-500 justify-center items-center px-4 pt-40">
      <View className="items-center mb-6">
        <Text className="text-xl font-bold text-white mb-2">
          co zamierzasz dzisiaj zrealizować? 👋
        </Text>
        <Text className="text-white">Jesteś zalogowany!</Text>
      </View>

      <View>
        <TextInput
          className="bg-white w-72 rounded-lg px-4 py-2 mb-4 text-black"
          placeholder="Wpisz zadanie..."
          placeholderTextColor="#999"
          value={taskText}
          onChangeText={setTaskText}
          onSubmitEditing={addTask}
        />
        <Pressable
          onPress={addTask}
          className="bg-white rounded-lg px-6 py-3 shadow-md"
          android_ripple={{ color: '#93c5fd' }}
        >
          <Text className="text-red-500 font-semibold text-center">Dodaj zadanie</Text>
        </Pressable>

        <FlatList
          className="mt-5"
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`flex-row items-center justify-between mb-3 ${
                item.id === editingTaskId ? 'bg-yellow-100 rounded px-2 py-1' : ''
              }`}
            >
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
                <Pressable onPress={() => toggleTaskCompletion(item.id)}>
                  <Text
                    className={`text-lg ${
                      item.completed ? 'line-through text-gray-400' : 'text-white'
                    }`}
                  >
                    {item.text}
                  </Text>
                </Pressable>
              )}
              <View className="flex-row gap-2 ml-4">
                <Pressable onPress={() => editTask(item.id, item.text)}>
                  <Text className="text-yellow-300">✏️</Text>
                </Pressable>
                <Pressable onPress={() => deleteTask(item.id)}>
                  <Text className="text-yellow-300">🗑️</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text className="text-white mt-4">Brak zadań</Text>}
        />
      </View>
    </View>
  );
}