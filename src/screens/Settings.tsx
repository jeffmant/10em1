import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@realm/react";
import { AppRoutesNavigatiorProps } from "@routes/app.routes";
import { Box, Center, Divider, HStack, Heading, Link, Text, VStack } from "native-base";
import { Star, Info, ChatCircleDots, CaretRight, ShareFat } from 'phosphor-react-native'
import { useState } from "react";
import { Alert, Linking, TouchableOpacity } from "react-native";

export function Settings () {
  const [isLoading, setIsLoading] = useState(false)
  const { logOut } = useAuth()

  const { navigate } = useNavigation<AppRoutesNavigatiorProps>()

  async function handleLogout () {
    setIsLoading(true)
    logOut()
    setIsLoading(false)
  }

  async function handleDeleteAccount () {
    try {
      console.log('handleDeleteAccount')
      Alert.alert(
        'Tem certeza que deseja excluir a sua conta?', 
        'Todos as suas atividades serão excluídas.', 
        [
          {
            text: 'Cancelar',
            onPress: () => console.log('Cancel'),
            style: 'cancel'
          },
          {
            text: 'Sim',
            onPress: async () => {         
              Linking.openURL('https://t.me/+MzgE4rzAgAE3YTMx')
            } 
          },
        ]
      )

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <VStack>
      <VStack>
        <Heading
          fontFamily="heading"
          fontSize={32}
          px={6}
          pt={16}
          pb={4}
        >
          Configurações
        </Heading>
      </VStack>

      <VStack mt={8} px={8} justifyContent="space-between">
        <Box
          rounded="2xl"
          bgColor="gray.100"
          width="100%"
          height={"64"}
          p={4}
          shadow={8}
        > 
          <TouchableOpacity onPress={() => navigate('about')}>
            <VStack mt={2}>
              <HStack alignItems="center">
                <Info size={28} />
                <Heading flex={1} fontFamily="body" fontSize="xl" fontWeight="medium" ml={2}>Sobre o App</Heading>
                <CaretRight size={24} />
              </HStack>
              <Divider mt={4} px={4} />
            </VStack>
          </TouchableOpacity>

          <TouchableOpacity disabled>
            <VStack mt={4}>
              <HStack alignItems="center">
                <Star size={28} />
                <Text flex={1} fontFamily="body" fontSize="xl" fontWeight="medium" ml={2}>Avaliar</Text>
                <Text fontFamily="body" fontSize="sm">Em breve</Text>
                {/* <CaretRight size={24} /> */}
              </HStack>
              <Divider mt={4} px={4} />
            </VStack>
          </TouchableOpacity>


          <TouchableOpacity disabled>
            <VStack mt={4}>
              <HStack alignItems="center">
                <ShareFat size={28} />
                <Heading flex={1} fontFamily="body" fontSize="xl" fontWeight="medium" ml={2}>Compartilhar</Heading>
                <Text fontFamily="body" fontSize="sm">Em breve</Text>
                {/* <CaretRight size={24} /> */}
              </HStack>
              <Divider mt={4} px={4} />
            </VStack>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://t.me/+MzgE4rzAgAE3YTMx')}>
            <VStack mt={4}>
              <HStack alignItems="center">
                <ChatCircleDots size={28} />
                <Heading flex={1} fontFamily="body" fontSize="xl" fontWeight="medium" ml={2}>Suporte</Heading>
                <CaretRight size={24} />
              </HStack>
            </VStack>
          </TouchableOpacity>

        </Box>

        <Button 
          title="Sair do App" 
          variant="solid"
          fontSize="md"
          mt={8}
          onPress={handleLogout}
          isLoading={isLoading}
        />

        <Center mt={8}>
          <Link 
            isUnderlined 
            onPress={handleDeleteAccount}
            _text={{
              fontFamily: 'body',
              fontSize: 'lg'
            }}
            isExternal={false}
          >
            Excluir minha conta
          </Link>
        </Center>

      </VStack>
    </VStack>
  )
}