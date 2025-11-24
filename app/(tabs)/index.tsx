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
  }, [navigation]);

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
<View className="flex-1 justify-center items-center px-4 pt-40" style={{ backgroundColor: '#f5f0e6' }}>
  <View className="items-center mb-6">
    <Text className="text-xl font-bold mb-2" style={{ color: '#4b3f2f', textAlign: 'center' }}>
      co zamierzasz dzisiaj zrealizować? 👋
    </Text>
    <Text style={{ color: '#4b3f2f' }}>Jesteś zalogowany!</Text>
  </View>

  <View>
    <TextInput
      className="w-72 rounded-lg px-4 py-2 mb-4"
      placeholder="Wpisz zadanie..."
      placeholderTextColor="#a89f8c"
      value={taskText}
      onChangeText={setTaskText}
      onSubmitEditing={addTask}
      style={{ backgroundColor: '#e6dfd0', color: '#4b3f2f' }}
    />

    <Pressable
      onPress={addTask}
      className="rounded-lg px-6 py-3 mb-4"
      style={{
        backgroundColor: '#bfa786',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}
      android_ripple={{ color: '#d6c4a1' }}
    >
      <Text className="font-semibold text-center" style={{ color: '#fff' }}>Dodaj zadanie</Text>
    </Pressable>

    <FlatList
      className="mt-5"
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          className="flex-row items-center justify-between mb-3 px-2 py-1 rounded"
          style={{
            backgroundColor: item.id === editingTaskId ? '#dfd3c0' : '#f5f0e6',
          }}
        >
          {item.id === editingTaskId ? (
            <View className="flex-row items-center gap-2">
              <TextInput
                value={editingTaskText}
                onChangeText={setEditingTaskText}
                onSubmitEditing={saveEditedTask}
                className="px-2 py-1 rounded w-48"
                style={{ backgroundColor: '#e6dfd0', color: '#4b3f2f' }}
                autoFocus
              />
              <Pressable onPress={saveEditedTask}>
                <Text style={{ color: 'green', fontWeight: 'bold' }}>✅</Text>
              </Pressable>
              <Pressable onPress={cancelEditing}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>❌</Text>
              </Pressable>
            </View>
          ) : <View className="flex-row items-center">
        <Pressable
          onPress={() => toggleTaskCompletion(item.id)}
          className="w-6 h-6 rounded-full border mr-3 flex items-center justify-center"
          style={{
          borderColor: item.completed ? '#bfa786' : '#4b3f2f',
         backgroundColor: item.completed ? '#bfa786' : 'transparent',
        }}
      >
        {item.completed && (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>
        )}
        </Pressable>

      <Pressable onPress={() => toggleTaskCompletion(item.id)}>
        <Text
      className="text-lg"
      style={{
        textDecorationLine: item.completed ? 'line-through' : 'none',
        color: item.completed ? '#a89f8c' : '#4b3f2f',
      }}
    >
      {item.text}
    </Text>
  </Pressable>
</View>}
          <View className="flex-row gap-2 ml-4">
            <Pressable onPress={() => editTask(item.id, item.text)}>
              <Text style={{ color: '#c19f6e' }}>✏️</Text>
            </Pressable>
            <Pressable onPress={() => deleteTask(item.id)}>
              <Text style={{ color: '#c19f6e' }}>🗑️</Text>
            </Pressable>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={{ color: '#4b3f2f', marginTop: 16, textAlign: 'center' }}>Brak zadań</Text>}
    />
  </View>
</View>
  );
}