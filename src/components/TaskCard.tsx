import { HStack, Heading, Icon, IconButton, Text, VStack } from "native-base";
import { TouchableHighlight, TouchableHighlightProps } from "react-native";
import { Entypo } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'

type TaskCardProps = TouchableHighlightProps & {
  data: any
  handleTask: (taskId: string) => void
}

export function TaskCard ({ data, handleTask, ...rest }: TaskCardProps) {
  return (
    <TouchableHighlight
      {...rest}
    >
      <HStack bg="gray.100" alignItems="center" p={4} pr={4} rounded="xl" mb={3} h={20}>
        <Icon as={MaterialIcons} name="directions-run" size="2xl" color="blue.500" mr={2} />

        <VStack flex={1}>
          <Heading
            color="gray.700"
            fontSize="lg"
            fontFamily="heading"
            strikeThrough={data.checked}
          >
            {data.title}
          </Heading>
          <Text fontSize="sm" color="gray.600" mt={1} numberOfLines={2}>
            {data.description}
          </Text>
        </VStack>

        <IconButton onPress={() => handleTask(data.id)} _pressed={{ backgroundColor: 'gray.100' }}>
          <Icon as={Entypo} name={ data.checked ? 'check' : 'circle' } size="lg" color={ data.checked ? 'green.500' : "gray.500" } />
        </IconButton>
      </HStack>

    </TouchableHighlight>
  )
}