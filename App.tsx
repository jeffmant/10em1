import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { NativeBaseProvider, StatusBar } from "native-base";
import { Routes } from '@routes/index';
import AppLoading from 'expo-app-loading';
import { AppProvider } from '@realm/react';
import { REALM_APP_ID } from '@env'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular, 
    Nunito_700Bold 
  });

  if(!fontsLoaded) {
    <AppLoading />
  }

  return (
    <AppProvider id={REALM_APP_ID}>
        <NativeBaseProvider>
          <SafeAreaProvider>
            <StatusBar
              barStyle='dark-content'
              backgroundColor='transparent'
              translucent
              />
            <Routes />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </AppProvider>
  );
}
