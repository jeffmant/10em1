import { Button } from "@components/Button";
import { useAuth } from "@realm/react";
import { Box, Divider, HStack, Heading, Text, VStack } from "native-base";
import { Star, Info, ChatCircleDots, CaretRight, ShareFat } from 'phosphor-react-native'
import { useState } from "react";

export function Settings () {
  const [isLoading, setIsLoading] = useState(false)
  const { logOut } = useAuth()

  function handleLogout () {
    setIsLoading(true)
    logOut()
    setIsLoading(false)
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
          <VStack mt={2}>
            <HStack alignItems="center">
              <Info size={28} />
              <Heading flex={1} fontFamily="body" fontSize="xl" fontWeight="medium" ml={2}>Sobre o App</Heading>
              <CaretRight size={24} />
            </HStack>
            <Divider mt={4} px={4} />
          </VStack>

          <VStack mt={4}>
            <HStack alignItems="center">
              <Star size={28} />
              <Text flex={1} fontFamily="body" fontSize="xl" fontWeight="medium" ml={2}>Avaliar</Text>
              <CaretRight size={24} />
            </HStack>
            <Divider mt={4} px={4} />
          </VStack>

          <VStack mt={4}>
            <HStack alignItems="center">
              <ShareFat size={28} />
              <Heading flex={1} fontFamily="body" fontSize="xl" fontWeight="medium" ml={2}>Compartilhar</Heading>
              <CaretRight size={24} />
            </HStack>
            <Divider mt={4} px={4} />
          </VStack>

          <VStack mt={4}>
            <HStack alignItems="center">
              <ChatCircleDots size={28} />
              <Heading flex={1} fontFamily="body" fontSize="xl" fontWeight="medium" ml={2}>Suporte</Heading>
              <CaretRight size={24} />
            </HStack>
          </VStack>
        </Box>

        <Button 
          title="Sair do App" 
          variant="outline"
          fontSize="md"
          mt={8}
          onPress={handleLogout}
          isLoading={isLoading}
        />

      </VStack>
    </VStack>
  )
}