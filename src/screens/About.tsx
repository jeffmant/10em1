import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { useNavigation } from "@react-navigation/native";
import { AppRoutesNavigatiorProps } from "@routes/app.routes";
import { Center, Heading, ScrollView, Text, VStack } from "native-base";
import { Linking } from "react-native";

export function About () {
  const { navigate } = useNavigation<AppRoutesNavigatiorProps>()

  return (
    <VStack flex={1}>
      <Header title="Sobre o App" handleGoBack={() => navigate('settings')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Center mt={6} px={10} flex={1}>

          <Heading
            fontFamily="heading"
            fontSize="xl"
            mt={2}
            mb={8}
          >
            Bora TTT?
          </Heading>

          <Text
            fontFamily="body"
            fontSize="xl"
          >
            Este aplicativo foi construído para ajudar os participantes da
            mentoria 10em1, O pior ano da sua vida do Pablo Marçal, a salvarem 
            seu progresso diário e acompanharem o avanço durante o ano.
          </Text>

          <Text
            fontFamily="body"
            fontSize="xl"
            mt={4}
          >
            O app está sendo construído por comunidade (movimento). Por isso, 
            todos os tipos de feedback, críticas e sugestões de melhoria são bem-vindos neste canal:
          </Text>
          
          <Button mt={8} title="Suporte do App" fontSize="xl" onPress={() => Linking.openURL('https://t.me/+MzgE4rzAgAE3YTMx')} />
        
          <Text
            fontFamily="heading"
            fontSize="md"
            fontWeight="bold"
            mt={4}
          >
            Versão: 4.0.0
          </Text>
        </Center>

      </ScrollView>
    </VStack>
  )
}