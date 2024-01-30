import { Center, Heading, Image, ScrollView, StatusBar, VStack, useToast } from "native-base";
import LogoImage from '@assets/logo.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutesNavigatiorProps } from "@routes/auth.routes";
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from "react";
import { useEmailPasswordAuth } from "@realm/react";

type SignupDTO = {
  email: string
  password: string
  confirmPassword: string
}

const signupValidationSchema = Yup.object({
  email: Yup.string().required('Insira o email').email('Email inválido'),
  password: Yup.string().required('Insira a senha').min(8, 'A senha precisa ter pelo menos 8 caracteres'),
  confirmPassword: Yup.string().required('Confirme a senha').oneOf([Yup.ref('password'), ''], 'As senhas devem ser iguais')
})

export function Signup () {
  const [isLoading, setIsLoading] = useState(false)
  
  const { navigate } = useNavigation<AuthRoutesNavigatiorProps>()

  const { control, handleSubmit, formState: { errors, isValid }, setError } = useForm<SignupDTO>({
    resolver: yupResolver(signupValidationSchema)
  })

  const {register, result, logIn } = useEmailPasswordAuth();

  const toast = useToast()


  async function handleSignup ({ email, password }: SignupDTO) {
    try {
      setIsLoading(true)

      register({ email, password })

      if(result.success) {
        logIn({ email, password })
      }

      if (result.error) {
        console.log(result.error)
        throw new Error()
      }

    } catch (error: any) {
      console.log(JSON.stringify(error))

      toast.show({
        title: 'Algo deu errado. Tente novamente!',
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
        <VStack flex={1} bg="#1B1B1F" px={10} justifyContent="space-evenly">
          <Center mt={8}>
            <Image 
              source={LogoImage}
              size={40}
              resizeMode="contain" 
              alt="App Logo"
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

            <Controller
              name="email"
              control={control}
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
              name="password"
              control={control}
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

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Confirmar senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors?.confirmPassword?.message}
                />
              )}
            />

            <Button 
              title="Criar conta"
              onPress={handleSubmit(handleSignup)}
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            />
          </Center>

          <Center my={8}>
            <Button 
              title="Voltar para login"
              variant="outline"
              onPress={() => navigate('signin')}
            />
            </Center>
        </VStack>
      </ScrollView>
    </>
  )
}