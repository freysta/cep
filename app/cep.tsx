
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

interface Endereco {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
}

export default function Cep() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConsultar = async () => {
    if (!cep.trim()) {
      Alert.alert('Erro');
      return;
    }
    setLoading(true);
    setEndereco(null);
    setError(null);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado ou inválido.');
      } else {
        setEndereco(data);
      }
    } catch (e) {
      setError('Ocorreu um erro ao buscar o CEP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultar CEP</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
        maxLength={8}
      />
      <Button title="Consultar" onPress={handleConsultar} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      {endereco && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Logradouro: {endereco.logradouro}</Text>
          <Text style={styles.resultText}>Bairro: {endereco.bairro}</Text>
          <Text style={styles.resultText}>Cidade: {endereco.localidade}</Text>
          <Text style={styles.resultText}>Estado: {endereco.uf}</Text>
          <Text style={styles.resultText}>CEP: {endereco.cep}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 46,
  },
  loader: {
    marginTop: 20,
  },
  resultContainer: {
    backgroundColor: '#fff',
  },
  resultText: {
    fontSize: 60,
    marginBottom: 8,
  },
});
