import { Center, Heading, Image, ScrollView, Text, VStack } from "native-base";
import LogoImage from '@assets/logo.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutesNavigatiorProps } from "@routes/auth.routes";


export function Signup () {
  const { navigate } = useNavigation<AuthRoutesNavigatiorProps>()

  return (
    <ScrollView 
      contentContainerStyle={{ 
        flexGrow: 1 
      }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg='gray.700' px={10} backgroundColor="#2a4858">
        <Center mt={8}>
          <Image 
            source={LogoImage}
            size={40}
            resizeMode="contain" 
          />
        </Center>

        <Center>
          <Heading 
            color="gray.100"
            fontSize="xl"
            mb={4}
            fontFamily="heading"
            >
            Crie sua conta
          </Heading>

          <Input
            placeholder="Nome"
            autoCapitalize="words"
          />

          <Input
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input 
            placeholder="Senha"
            secureTextEntry
          />

          <Input 
            placeholder="Confirmar senha"
            secureTextEntry
          />

          <Button 
            title="Criar conta" 
          />
        </Center>

        <Center mt={8}>
          <Text
            color="gray.100"
            fontSize="sm"
            mb={3}
            fontFamily="body"
          >
            Já tem conta?
          </Text>
          <Button 
            title="Voltar para login"
            variant="outline"
            onPress={() => navigate('signin')}
          />
          </Center>
      </VStack>
    </ScrollView>
  )
}