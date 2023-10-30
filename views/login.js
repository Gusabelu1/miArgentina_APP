import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Alert, Button, NativeModules } from 'react-native';
import authContext from '../contexts/authContext.js';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function verifyToken(token) {
  const url = 'https://argentina-campeon.herokuapp.com/auth/verify';
    return await axios.get(url, {
      params: {
        token: token
      }
    })
    .then((response) => {
      return response.data.exp;
    })
    .catch(() => {
    });
}

function login(dni, password) {
  axios.get('https://argentina-campeon.herokuapp.com/auth/login', {
    params: {
      dni: dni,
      password: password
    }
  }).then(async (response) => {
    await AsyncStorage.setItem('localToken', response.data.Token)
    await AsyncStorage.setItem('localDni', dni)
    NativeModules.DevSettings.reload();
  }).catch(async (error) => {
    await AsyncStorage.setItem('errorLogin', "true")
  })
}

export default function Login() {
  const [tokenValid, setTokenValid] = useState();
  const [dni, setDni] = useState('');
  const [passwd, setPasswd] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const { setValidToken } = useContext(authContext);

  function onTextChanged(value) {
    setDni({ dni: value.replace(/[^0-9]/g, '')});
  }

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('localToken')
      

      const tokenValido = await verifyToken(token)
      console.log(tokenValido)
      setTokenValid(tokenValido)
    })();
  }, []);
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        onChangeText={setDni}
        value={dni}
        placeholder="DNI"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPasswd}
        value={passwd}
        placeholder="Contraseña"
        secureTextEntry={true}
      />
      <Text style={{color: '#000000', marginTop: 10}}>Si los datos son correctos, reiniciá la aplicación para acceder</Text>
      <Text style={{marginVertical: 10}}></Text>
      <Button
        title="Iniciar Sesión"
        onPress={async () => {
          if (!dni || !passwd) {
            null
          } else {
            login(dni, passwd)
          }
        }}
      />
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1d1d27',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // card: {
  //     backgroundColor: '#fff',
  //     padding: '2rem',
  //     borderRadius: 10,
  // },

  input: {
    textAlign: 'center',
    width: '50%',
    borderBottomWidth: 1.5,
    borderBottomColor: '#00000066',
    marginTop: 25,
    paddingTop: 8,
    paddingRight: 8,
    paddingLeft: 8
  }
});