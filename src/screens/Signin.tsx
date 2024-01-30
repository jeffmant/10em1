import { Center, Heading, Image, Link, ScrollView, StatusBar, Text, VStack, useToast } from "native-base";
import LogoImage from '@assets/logo.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutesNavigatiorProps } from "@routes/auth.routes";
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, FieldError, useForm } from "react-hook-form";
import { useState } from "react";
import { FontAwesome } from '@expo/vector-icons'
import { useEmailPasswordAuth } from "@realm/react";

type SigninDTO = {
  email: string
  password: string
}

const signinValidationSchema = Yup.object({
  email: Yup.string().required('Informe o email').email('Email inválido'),
  password: Yup.string().required('Informe a senha').min(8, 'Insira pelo menos 8 dígitos')
})

export function Signin () {
  const { navigate } = useNavigation<AuthRoutesNavigatiorProps>()

  const toast = useToast()

  const { control, handleSubmit, setError, formState: { errors, isValid } } = useForm<SigninDTO>({
    resolver: yupResolver(signinValidationSchema)
  })

  const {logIn, result: { error }} = useEmailPasswordAuth();

  const [isLoading, setIsLoading] = useState(false)


  async function handleSignin ({ email, password }: SigninDTO) { 
    try {
      setIsLoading(true)

      logIn({ email, password })

      if (error) {
        throw new Error()
      }
     
    } catch (error: any) {
      toast.show({
        description: "Algo deu errado. Tente novamente!",
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
    
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1 
        }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} bg="#1B1B1F" px={10} justifyContent="space-around">
          <Center my={8}>
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

          <Center mt={8}>
            <Heading 
              color="gray.100"
              fontSize="xl"
              mb={4}
              fontFamily="heading"
              >
              Acesse sua conta
            </Heading>

            <Controller 
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input 
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors?.email?.message}
                />
              )}
            />

            <Controller 
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input 
                  placeholder="Senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors?.password?.message}
                />
              )}
            />

            <Button
              title="Entrar"
              onPress={handleSubmit(handleSignin)}
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            />

          </Center>

          <Center my={8}>
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
    </>
  )
}