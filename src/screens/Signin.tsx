import { Center, Image, ScrollView, Text, VStack, useToast } from "native-base";
import LogoImage from '@assets/logo.png'
import { Button } from "@components/Button";
import { useState } from "react";
import { FontAwesome } from '@expo/vector-icons'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { Realm, useApp } from '@realm/react'

export function Signin () {
  const [isLoading, setIsLoading] = useState(false)
  const app = useApp()
  
  const toast = useToast()

  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID
  })

  async function handleGoogleSignin() {
    try {
      setIsLoading(true)

      const { idToken } = await GoogleSignin.signIn()
      
      if (idToken) {
        const realmCredentials = Realm?.Credentials?.jwt(idToken)
        await app.logIn(realmCredentials)
      }
      
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível entrar com sua conta Google',
        placement: 'top',
        color: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={{ 
        flexGrow: 1 
      }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg="#1B1B1F" px={10} justifyContent="space-evenly">
        <Center>
          <Image 
            source={LogoImage}
            size={40}
            resizeMode="contain"
            alt="App Logo"
          />

          <Text
            color="gray.100"
            fontSize="xl"
          >
            Sangue, suor, lágrima e gordura.
          </Text>
        </Center>

        <Center mb={32}>
          <Button 
            title="Entrar com Google"
            startIcon={<FontAwesome name="google" color="white" size={20} />}
            onPress={handleGoogleSignin}
            isLoading={isLoading}
          />
        </Center>

      </VStack>
    </ScrollView>
  )
}