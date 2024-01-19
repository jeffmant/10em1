import { HStack, Heading, Icon, IconButton, Text, VStack } from "native-base";
import { TouchableHighlight, TouchableHighlightProps } from "react-native";
import { Entypo } from '@expo/vector-icons'

export type TaskCardProps = {
  id: string
  title: string
  description: string
  checked: boolean
  date?: string
  order: number
  icon: string
}

type Props = TouchableHighlightProps & {
  data: TaskCardProps
  handleTask: (taskId: string) => void
}

export function TaskCard ({ data, handleTask, ...rest }: Props) {
  return (
    <TouchableHighlight
      {...rest}
    >
      <HStack bg="gray.100" alignItems="center" p={4} pr={4} rounded="xl" mb={3} h={20}>
        <Text fontSize={28} mr={4}>{data.icon}</Text>

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