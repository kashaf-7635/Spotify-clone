import { StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from "react-native-bootsplash";
import AppNavigation from './src/navigation/AppNavigation';
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import Loading from './src/components/Loading';
import { setupPlayer } from './src/utils/helpers/player';


const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      console.log('App initializing...');
      await setupPlayer();
      console.log('TrackPlayer init success:');
      setIsReady(true);
      await BootSplash.hide({ fade: true });
      console.log('BootSplash has been hidden successfully');
    };

    init();
  }, []);


  if (!isReady) return <Loading />;
  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </PersistGate>
      </Provider>



    </>
  )
}

export default App

const s = StyleSheet.create({
  main: {
    flex: 1
  }
})