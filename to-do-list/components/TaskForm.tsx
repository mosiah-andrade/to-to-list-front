import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Keyboard,
  ActivityIndicator, // Para mostrar o loading
  Alert 
} from "react-native";
import axios from 'axios';

// ⚠️ IMPORTANTE: Substitua pela sua URL do Codespaces (sem a barra no final)
const API_URL = "https://to-do-list-back-3pwl.onrender.com";

// Agora a prop serve para avisar o pai que "Deu certo" e passar a nova task criada
interface TaskFormProps {
  onSuccess: (newTask: any) => void;
}

export default function TaskForm({ onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

  const handleSubmit = async () => {
    // 1. Validação local
    if (title.trim() === '') {
      Alert.alert("Erro", "O título é obrigatório");
      return;
    }

    // 2. Inicia o loading
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // 3. Envia para o Backend (Node.js)
      const response = await axios.post(`${API_URL}/todos`, {
        title: title,
        description: description,
        // O status "opened" e o ID geralmente são criados pelo backend, 
        // mas se seu back esperar status, adicione aqui.
      });

      // 4. Se deu certo, avisa o componente Pai para atualizar a lista
      // O backend deve retornar a task criada (response.data)
      onSuccess(response.data);

      // 5. Limpa os campos
      setTitle('');
      setDescription('');

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a tarefa.");
    } finally {
      // 6. Finaliza o loading (independente de erro ou sucesso)
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Título da tarefa *"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
        editable={!isLoading} // Bloqueia digitação enquanto carrega
      />
      
      <TextInput
        style={[styles.input, styles.textArea]} 
        placeholder="Descrição (detalhes...)"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline={true} 
        numberOfLines={3} 
        textAlignVertical="top" 
        editable={!isLoading}
      />
      
      <TouchableOpacity 
        style={[styles.addButton, isLoading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={isLoading} // Desabilita o clique enquanto carrega
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.addButtonText}>Adicionar Tarefa</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20,
    gap: 12, 
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  textArea: {
    height: 80, 
    paddingTop: 12, 
  },
  addButton: {
    height: 50,
    backgroundColor: '#4630EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0E0', // Cor mais clara quando desabilitado
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});