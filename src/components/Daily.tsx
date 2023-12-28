import { Heading, IPressableProps, Pressable, Text, VStack } from "native-base";

type DailyProps = IPressableProps & {
  numberDay: string
  weekDay: string
  isActive: boolean
}

export function Daily ({ numberDay, weekDay, isActive, ...rest }: DailyProps) {
  return (
    <Pressable
      mr={3}
      w={12}
      h={16}
      bg="gray.100"
      rounded="xl"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderWidth: 2,
        borderColor: "blue.700"
      }}
      {...rest}
    >   
      <VStack justifyContent="center" alignItems="center">
        <Heading
          color={ isActive ? "gray.700" : "gray.500"}
          fontFamily="heading"
          fontSize="lg"
        >
          {numberDay}
        </Heading>
        <Text
          color={ isActive ? "gray.700" : "gray.500"}
          textTransform="uppercase"
          fontSize="md"
          fontFamily="body"
        >
          {weekDay}
        </Text>
      </VStack>
    </Pressable>
  )
}