import { Text, View } from 'react-native';
import {  
  useFonts, 
  Nunito_300Light, 
  Nunito_400Regular, 
  Nunito_500Medium, 
  Nunito_600SemiBold, 
  Nunito_700Bold 
} from '@expo-google-fonts/nunito';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light, 
    Nunito_400Regular, 
    Nunito_500Medium, 
    Nunito_600SemiBold, 
    Nunito_700Bold 
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {
        fontsLoaded && 
          <Text style={{ fontFamily: 'Nunito_400Regular', fontSize: 40 }}>10em1</Text>
      }
    </View>
  );
}
