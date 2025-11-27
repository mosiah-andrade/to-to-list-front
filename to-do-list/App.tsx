import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import TaskForm from './components/TaskForm'; // Importa o componente que criamos antes

// ⚠️ ATENÇÃO: Substitua pela URL do seu Codespace (da aba PORTS)
// Exemplo: 'https://solid-funicular-wr7v7.preview.app.github.dev'
const API_URL = 'https://to-do-list-back-3pwl.onrender.com'; 

export default function App() {
  const [tasks, setTasks] = useState<any[]>([]); // Lista de tarefas
  const [isLoading, setIsLoading] = useState(true); // Loading inicial

  // 1. Função para buscar tarefas do Backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar:", error);
      Alert.alert("Erro", "Não foi possível carregar as tarefas.");
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega as tarefas assim que o App abre
  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Função chamada quando o TaskForm cria uma tarefa com sucesso
  const handleTaskCreated = (newTask: any) => {
    // Adiciona a nova tarefa na lista visualmente imediatamente
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // 3. Função para deletar tarefa
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      // Remove da lista visual filtrando pelo ID
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      Alert.alert("Erro", "Falha ao deletar tarefa.");
    }
  };

  // 4. Função para marcar/desmarcar (Toggle)
  const handleToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'opened' ? 'done' : 'opened';
    
    // Atualização Otimista (Atualiza a tela antes de esperar o servidor)
    setTasks((prevTasks) => 
      prevTasks.map((task) => 
        task.id === id ? { ...task, status: newStatus } : task
      )
    );

    try {
      // Envia a atualização para o backend
      // Nota: Seu backend precisa suportar PUT ou PATCH para isso funcionar 100%
      await axios.put(`${API_URL}/todos/${id}`, { status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status", error);
      // Se der erro, reverte a mudança visual (opcional)
    }
  };

  // --- RENDERIZAÇÃO DE CADA ITEM DA LISTA ---
  const renderItem = ({ item }: { item: any }) => {
    const isDone = item.status === 'done';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.row}>
            <Checkbox
              style={styles.checkbox}
              value={isDone}
              onValueChange={() => handleToggle(item.id, item.status)}
              color={isDone ? '#4630EB' : undefined}
            />
            <Text style={[styles.title, isDone && styles.textStruck]}>
              {item.title}
            </Text>
          </View>
          
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Só mostra a descrição se ela existir */}
        {item.description ? (
          <Text style={[styles.description, isDone && styles.textStruck]}>
            {item.description}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      
      <Text style={styles.headerTitle}>To-Do List</Text>

      {/* Componente de Formulário */}
      <TaskForm onSuccess={handleTaskCreated} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#4630EB" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Fundo cinza claro
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 16,
  },
  // Estilos do Card de Tarefa
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra no Android
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Ocupa o espaço restante antes do botão X
  },
  checkbox: {
    marginRight: 12,
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1, // Quebra linha se necessário
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginLeft: 30, // Alinha com o texto do título (pulando o checkbox)
    marginTop: 4,
  },
  textStruck: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteText: {
    color: '#FF3B30', // Vermelho iOS
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
});