import { HStack, Heading, VStack, Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons'
import { UserPhoto } from "./UserPhoto";
import { TouchableOpacity } from "react-native";
import userPhotoDefault from '@assets/userPhotoDefault.png'
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { AppRoutesNavigatiorProps } from "@routes/app.routes";


export function HomeHeader () {
  const { user } = useUser()
  const { navigate } = useNavigation<AppRoutesNavigatiorProps>()

  return (
    <HStack bg="gray.100" pt={16} pb={5} px={8} alignItems="center">
      <TouchableOpacity onPress={() => navigate('profile')} >
        <UserPhoto 
          source={
            { uri: user?.imageUrl} || userPhotoDefault
          }
          alt="Imagem do usuário"
          size={12}
          mr={2}
        />
      </TouchableOpacity>
      
      <VStack flex={1}>
        <Heading color="gray.700" fontSize="md" fontFamily="heading">
          Jefferson
        </Heading>
      </VStack>
     
      <TouchableOpacity>
        <Icon 
          as={MaterialIcons} 
          name="notifications"
          color="gray.500"
          size={7}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon 
          as={MaterialIcons} 
          name="settings"
          color="gray.500"
          size={7}
          ml={4}
        />
      </TouchableOpacity>
    </HStack>
  )
}