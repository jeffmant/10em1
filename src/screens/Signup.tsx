import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from "native-base";
import LogoImage from '@assets/logo.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutesNavigatiorProps } from "@routes/auth.routes";
import { Controller, FieldError, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from "react";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";

type SignupDTO = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const signupValidationSchema = Yup.object({
  name: Yup.string().required('Insira o nome'),
  email: Yup.string().required('Insira o email').email('Email inválido'),
  password: Yup.string().required('Insira a senha').min(8, 'A senha precisa ter pelo menos 8 caracteres'),
  confirmPassword: Yup.string().required('Confirme a senha').oneOf([Yup.ref('password'), ''], 'As senhas devem ser iguais')
})

export function Signup () {
  const [isLoading, setIsLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  
  const { navigate } = useNavigation<AuthRoutesNavigatiorProps>()

  const { control, handleSubmit, formState: { errors, isValid }, setError } = useForm<SignupDTO>({
    resolver: yupResolver(signupValidationSchema)
  })

  const { signUp, isLoaded, setActive } = useSignUp()

  const toast = useToast()

  async function handleSignup (data: SignupDTO) {
    setIsLoading(true)
    if (!isLoaded) {
      return;
    }

    console.log(data)

    try {
      await signUp.create({
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ')[1] || '',
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      setPendingVerification(true)

    } catch (error: any) {
      console.log(JSON.stringify(error))
      if (isClerkAPIResponseError(error)) {
        for (const err of error.errors) {
          if (err.meta?.paramName) {
            setError((
              err.meta.paramName === 'email_address' ? 
              "email" : 
              err.meta.paramName
            ) as keyof SignupDTO, { 
              message: err.message 
            } as FieldError)
          }
        }
      }
      toast.show({
        title: error.message || 'Algo deu errado. Tente novamente!',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onPressVerify = async () => {
    setIsLoading(true)
    if (!isLoaded) {
      return;
    }
 
    try {
      const { createdSessionId } = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (!createdSessionId) {
        throw new Error("Código inválido")
      }
      
      await setActive({ session: createdSessionId });

    } catch (error: any) {
      toast.show({
        title: 'Algo deu errado. Tente novamente!',
        placement: 'top',
        bgColor: 'red.500'
      })
      navigate('signup')
    } finally {
      setCode('')
      setPendingVerification(false)
      setIsLoading(false)
    }
  };

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
          {
            !pendingVerification ? (
              <>
                <Heading 
                  color="gray.100"
                  fontSize="xl"
                  mb={4}
                  fontFamily="heading"
                  >
                  Crie sua conta
                </Heading>
      
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      placeholder="Nome"
                      autoCapitalize="words"
                      value={value}
                      onChangeText={onChange}
                      errorMessage={errors?.name?.message}
                    />
                  )}
                />
      
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
              </>
            ) : (
              <>
                <Text
                  color="gray.100"
                  fontFamily="body"
                  mb={4}
                  fontSize="md"
                >
                  Enviamos um código no seu email. {"\n"}
                  Por gentileza, insira-o aqui:
                </Text>

                <Input 
                  placeholder="Código"
                  keyboardType="numeric"
                  value={code}
                  onChangeText={setCode}
                />

                <Button
                  title="Confirmar"
                  onPress={onPressVerify}
                  isLoading={isLoading}
                />
              </>
            )
          }
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