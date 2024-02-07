import 'react-native-get-random-values'
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { NativeBaseProvider, StatusBar } from "native-base";
import { Routes } from '@routes/index';
import { AppProvider } from '@realm/react';
import { REALM_APP_ID, ONE_SIGNAL_APP_ID } from '@env'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Loading } from '@components/Loading';
import { OneSignal } from 'react-native-onesignal';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular, 
    Nunito_700Bold 
  });

  if(!fontsLoaded) {
    <Loading flex={1} />
  }

  OneSignal.initialize(ONE_SIGNAL_APP_ID)

  OneSignal.Notifications.requestPermission(true)

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
