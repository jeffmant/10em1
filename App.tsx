import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { NativeBaseProvider, Spinner, StatusBar } from "native-base";
import { Routes } from '@routes/index';
import { ClerkProvider } from "@clerk/clerk-expo";
import Constants from "expo-constants"
import { tokenCache } from '@storage/auth.storage';
import { TokenCache } from '@clerk/clerk-expo/dist/cache';

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
      <ClerkProvider 
        publishableKey={Constants?.expoConfig?.extra?.clerkPublishableKey}
        tokenCache={tokenCache as TokenCache}
      >
        {
          fontsLoaded ? <Routes /> : <Spinner />
        }
       </ClerkProvider>
    </NativeBaseProvider>
  );
}
