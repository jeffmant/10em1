import { Center, Heading, Image, ScrollView, Text, VStack } from "native-base";
import BackgroundImage from '@assets/background.jpg'
import LogoImage from '@assets/logo.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutesNavigatiorProps } from "@routes/auth.routes";


export function Signin () {
  const { navigate } = useNavigation<AuthRoutesNavigatiorProps>()

  return (
    <ScrollView 
      contentContainerStyle={{ 
        flexGrow: 1 
      }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg='gray.700' px={10} backgroundColor="#2a4858">
        <Center my={8}>
          <Image 
            source={LogoImage}
            size={40}
            resizeMode="contain" 
          />
          <Text
            color="gray.100"
            fontSize="xl"
          >
            Sangue, suor, lágrima e gordura.
          </Text>
        </Center>

        <Center mt={8}>
          <Heading 
            color="gray.100"
            fontSize="xl"
            mb={4}
            fontFamily="heading"
            >
            Acesse sua conta
          </Heading>

          <Input
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input 
            placeholder="Senha"
            secureTextEntry
          />

          <Button 
            title="Acessar" 
          />
        </Center>

        <Center mt={16}>
          <Text
            color="gray.100"
            fontSize="sm"
            mb={3}
            fontFamily="body"
          >
            Ainda não tem acesso?
          </Text>
          <Button 
            title="Criar conta"
            variant="outline"
            onPress={() => navigate('signup')}
          />
          </Center>
      </VStack>
    </ScrollView>
  )
}