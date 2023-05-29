import React, { useState } from 'react';
import { StyleSheet, View} from 'react-native';
import { Button, Input, ListItem, Text} from 'react-native-elements';
import axios from 'axios';


export default function App() {
  const [sentimentoDigitado, setSentimento] = useState('');
  const [sentimentoItem, setSentimentosItem] = useState([]);
  
  const [sentimentos, setSentimentos] = useState([]);

  const capturarSentimento = (sentimentoDigitado) => {
    setSentimento(sentimentoDigitado);
  };

  const adicionarSentimento = () => {
    if (sentimentoDigitado.trim() !== '') {
      setSentimentosItem((sentimentoItem) => {
        const aux = [sentimentoDigitado, ...sentimentoItem];
        setSentimento('');
        return aux;
      });
      obterSentimento(sentimentoDigitado);
    }
  };

  const removerSentimento = (index) => {
    setSentimentosItem((sentimentoItem) => {
      const aux = [...sentimentoItem];
      aux.splice(index, 1);
      return aux;
    });
  };

  const obterSentimento = (texto) => {
    axios.post('http://localhost:4000/sentimentos', { texto })
      .then(response => {
        const sentimentoDoBackend = response.data.sentimento;
        setSentimentos(sentimentos => [sentimentoDoBackend, ...sentimentos]);
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  };

  const sentimentosExibidos = sentimentoItem.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Input
          placeholder="Digite uma frase"
          inputStyle={styles.sentimentoTextInput}
          onChangeText={capturarSentimento}
          value={sentimentoDigitado}
        />
        <Button 
          title="Enviar 🤖"
          buttonStyle={styles.buttonEnviar}
          titleStyle={styles.buttonText}
          onPress={adicionarSentimento} 
        />
      </View>
      <View style={styles.sentimentosView}>
        {sentimentosExibidos.map((sentimentoDigitado, index) => (
        <ListItem key={index} onLongPress={() => removerSentimento(index)} containerStyle={styles.listItem}>
          <ListItem.Content>
            <Text>Frase: {sentimentoDigitado}</Text>
            <p style={styles.resposta}>Sentimento: {sentimentos[index]}</p>
          </ListItem.Content>
        </ListItem>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    width: '100%',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to right top, #845ec2, #0078d1, #0086c1, #008d9f, #008f7a);',
    fontFamily: 'Segoe UI'
  },
  sentimentoTextInput: {
    borderColor: '#808080',
    padding: 12,
    textAlign: 'left',
    backgroundColor: '#DADDE2',
    borderRadius: 8,
    fontWeight: 'bold'
  },
  buttonEnviar: {
    backgroundColor: '#DADDE2',
    borderRadius: 8,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItem: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white'
  },
  sentimentosView: {
    width: '50%',
    marginTop: 8,
    borderRadius: 8,
    padding: 12,
    fontSize: '14'
  },
  resposta: {
    display: 'inline',
    fontWeight: 'bold'
  }
});