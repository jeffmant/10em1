import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from "native-base";
import LogoImage from '@assets/logo.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutesNavigatiorProps } from "@routes/auth.routes";
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, FieldError, useForm } from "react-hook-form";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";

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
  const { signIn, setActive, isLoaded } = useSignIn();

  const toast = useToast()

  const { control, handleSubmit, setError, formState: { errors, isValid } } = useForm<SigninDTO>({
    resolver: yupResolver(signinValidationSchema)
  })

  const [isLoading, setIsLoading] = useState(false)

  async function handleSignin ({ email, password }: SigninDTO) { 
    setIsLoading(true)
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (error: any) {
      if (isClerkAPIResponseError(error)) {
        for (const err of error.errors) {
          if (err.meta?.paramName) {
            setError((
              err.meta.paramName === 'email_address' ? 
              "email" : 
              err.meta.paramName
            ) as keyof SigninDTO, { 
              message: err.message 
            } as FieldError)
          }
        }
      }
      toast.show({
        description: error.message || "Algo deu errado. Tente novamente!",
        placement: 'top',
        bgColor: 'red.500'
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