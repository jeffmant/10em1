import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { NativeBaseProvider, Center, Text, StatusBar } from "native-base";

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular, 
    Nunito_700Bold 
  });

  return (
    <NativeBaseProvider>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
      <Center flex={1} backgroundColor="gray.700">
        {
          fontsLoaded && 
            <Text style={{ fontFamily: 'Nunito_400Regular' }} fontSize={34} color="gray.300">10em1</Text>
        }
      </Center>
    </NativeBaseProvider>
  );
}
