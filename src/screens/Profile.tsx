import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { UserPhoto } from "@components/UserPhoto";
import { Center, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { useState } from "react";

import { TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import * as Yup from 'yup'

import userPhotoDefault from '@assets/userPhotoDefault.png'
import { Controller, FieldError, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isClerkAPIResponseError, useClerk, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

type ProfileDTO = {
  name: string
  email: string
  oldPassword: string
  password: string
  confirmPassword: string
}

const profileSchema = Yup.object({
  name: Yup
    .string()
    .required('Informe o nome'),
  password: Yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirmPassword: Yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([Yup.ref('password'), ''], 'As senhas devem ser iguais')
    .when('password', {
      is: (Field: any) => Field,
      then: () => Yup
        .string()
        .nullable()
        .required('Informe a confirmação de senha')
        .transform((value) => !!value ? value : null), 
    })
})

const PHOTO_SIZE = 32

export function Profile () {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { goBack } = useNavigation()

  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState(user?.imageUrl)
  const [isLoading, setIsLoading] = useState(false)
 
  const toast = useToast()
  const { control, handleSubmit, formState: { errors }, setError } = useForm<ProfileDTO>({
    defaultValues: {
      name: user?.firstName + ' ' + user?.lastName,
      email: user?.primaryEmailAddress?.emailAddress
    },
    resolver: yupResolver(profileSchema) as unknown as Resolver<ProfileDTO, any>
  })

  async function handleSelectImage () {
    setPhotoIsLoading(true)
  
    try {
      const selectedImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      })
  
      if (selectedImage.canceled) {
        return
      }
  
      if (selectedImage.assets?.[0]?.uri) {
        const photoInfo = await FileSystem.getInfoAsync(selectedImage.assets[0].uri, { size: true }) as any

        if (photoInfo?.size && (photoInfo.size / 1024 / 1024) > 3 ) {
          return toast.show({
            title: "'Imagem muito grande. Por favor, escolha uma de até 3MB'",
            placement: 'top',
            bgColor: "red.500"
          })
        }

        const fileExtension = selectedImage.assets?.[0]?.uri.split('.').pop()

        const imageFile = {
          name: `${user?.firstName}.${fileExtension}`.toLowerCase(),
          uri: selectedImage.assets?.[0]?.uri,
          type: `${selectedImage.assets?.[0]?.type}/${fileExtension}`
        } as any

        await user?.setProfileImage({
          file: imageFile
        })

        setUserPhoto(selectedImage.assets?.[0]?.uri)

        toast.show({
          title: 'Foto atualizada com sucesso!',
          placement: 'top',
          color: 'red.500'
        })
      }
    } catch (error: any) {
      if (isClerkAPIResponseError(error)) {
        for (const err of error.errors) {
          if (err.meta?.paramName) {
            setError((
              err.meta.paramName === 'email_address' ? 
              "email" : 
              err.meta.paramName
            ) as keyof ProfileDTO, { 
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
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate (data: ProfileDTO) {
    setIsLoading(true)
    try {
      await user?.update({
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ')[1] || '',
      })

      toast.show({
        title: 'Perfil atualizado com sucesso',
        placement: 'top',
        color: 'green.500'
      })
      
    } catch (error: any) {
      if (isClerkAPIResponseError(error)) {
        for (const err of error.errors) {
          if (err.meta?.paramName) {
            setError((
              err.meta.paramName === 'email_address' ? 
              "email" : 
              err.meta.paramName
            ) as keyof ProfileDTO, { 
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
    <VStack flex={1}>
      <Header title="Perfil" handleGoBack={() => goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ? (
              <Skeleton 
                w={PHOTO_SIZE} 
                h={PHOTO_SIZE} 
                rounded="full" 
                startColor="gray.500" 
                endColor="gray.400" 
              />
            ) : (
              <UserPhoto
                source={
                  { uri: userPhoto } || userPhotoDefault
                }
                alt="Foto do usuário"
                size={PHOTO_SIZE}
              />
            )
          }

          <TouchableOpacity onPress={handleSelectImage}>
            <Text
              color="blue.600" 
              fontWeight="bold" 
              fontSize="md" 
              mt={2} 
              mb={8}
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Controller 
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />  
            )}
          />

          <Controller 
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                color="white"
                placeholder="Email"
                isDisabled
                value={value}
                onChangeText={onChange}
              />  
            )}
          />

          <Button 
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isLoading}
          />

          <TouchableOpacity onPress={() => signOut()}>
            <Text
              mt={16} 
              fontFamily="heading" 
              fontSize="md" 
              color="blue.600" 
              fontWeight="bold"
            >
              Sair
            </Text>
          </TouchableOpacity>
        </Center>
        
      </ScrollView>
    </VStack>
  )
}