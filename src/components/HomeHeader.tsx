import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons'
import { UserPhoto } from "./UserPhoto";
import { TouchableOpacity } from "react-native";
import userPhotoDefault from '@assets/userPhotoDefault.png'
import { useClerk } from "@clerk/clerk-expo";


export function HomeHeader () {
  const { signOut } = useClerk()

  return (
    <HStack bg="gray.100" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto 
        source={userPhotoDefault}
        alt="Imagem do usuário"
        size={16}
        mr={4}
      />
      
      <VStack flex={1}>
        <Text color="gray.700" fontSize="md">
          Olá,
        </Text>

        <Heading color="gray.700" fontSize="md" fontFamily="heading">
          Jefferson
        </Heading>
      </VStack>

      <TouchableOpacity onPress={() => signOut()}>
        <Icon 
          as={MaterialIcons} 
          name="logout"
          color="gray.700"
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}