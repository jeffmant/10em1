import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { NativeBaseProvider, Spinner, StatusBar } from "native-base";
import { Routes } from '@routes/index';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular, 
    Nunito_700Bold 
  });

  return (
    <NativeBaseProvider>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent
      />
      {
        fontsLoaded ? <Routes /> : <Spinner />
      }
    </NativeBaseProvider>
  );
}
