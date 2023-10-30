import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import Login from './views/login'
import authContext from './contexts/authContext.js';

SplashScreen.preventAutoHideAsync();

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

export default function App() {
  const [validToken, setValidToken] = useState()
  const [localToken, setLocalToken] = useState()
  const [localDni, setLocalDni] = useState()
  const [appIsReady, setAppIsReady] = useState(false);
  const data = "saveData('" + localDni + "', '" + localToken + "')"

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('localToken')
      const dni = await AsyncStorage.getItem('localDni')
      setLocalToken(token)
      setLocalDni(dni)

      let tokenValido

      tokenValido = await verifyToken(token)
      if (tokenValido) {
        console.log(tokenValido)
        setValidToken(true)
        setAppIsReady(true)
      } else {
        setValidToken(false)
        setAppIsReady(true)
      }
    })();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
    console.log(appIsReady)
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <authContext.Provider value={{ validToken, setValidToken }}>
        { validToken && validToken ?
         <SafeAreaView style={styles.webContainer} onLayout={onLayoutRootView}>
            <WebView 
              source={{uri: 'https://bit.ly/3rXVHIW'}} 
              style={styles.web}
              startInLoadingState={true}
              javaScriptEnabled={true}
              injectedJavaScript={data}
              onMessage={(event) => {}}
            />
         </SafeAreaView>
        :
        <View onLayout={onLayoutRootView} style={styles.container}>
          <Login />
        </View>
        }
      </authContext.Provider>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  webContainer: {
    flex: 1,
    backgroundColor: '#1282ba',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  web: {
    flex: 1,
    marginTop: 30,
    // marginBottom: 20
  }
});