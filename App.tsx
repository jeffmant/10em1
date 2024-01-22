import 'react-native-get-random-values'
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { NativeBaseProvider, StatusBar } from "native-base";
import { Routes } from '@routes/index';
import { AppProvider } from '@realm/react';
import { REALM_APP_ID } from '@env'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Loading } from '@components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular, 
    Nunito_700Bold 
  });

  if(!fontsLoaded) {
    <Loading flex={1} />
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
