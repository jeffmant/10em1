import { Header } from "@components/Header";
import { useNavigation } from "@react-navigation/native";
import { AppRoutesNavigatiorProps } from "@routes/app.routes";
import { Center, Heading, ScrollView, Text, VStack } from "native-base";

export function Notification () {
  const { goBack } = useNavigation<AppRoutesNavigatiorProps>()

  return (
    <VStack flex={1}>
      <Header title="Notificações" handleGoBack={() => goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Center mt={6} px={10}>
          <Text
            fontFamily="heading"
            fontSize="xl"
          >
            Nenhuma notificação 🍃
          </Text>
        </Center>
      </ScrollView>
    </VStack>
  )
}