import { IButtonProps, Button as NativeBaseButton, Text } from 'native-base'

type ButtonProps = IButtonProps & {
  title: string
  button?: 'solid' | 'outline'
}

export function Button ({ title, bg, color, variant = 'solid', fontSize, ...rest }: ButtonProps) {
  return (
    <NativeBaseButton
      w="full"
      h={16}
      bg={bg ? bg : variant === 'outline' ? "transparent" : "blue.700"}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor="blue.500"
      rounded="xl"
      _pressed={{
        bg: variant === 'outline' ? "gray.500" : "blue.500"
      }}
      {...rest}
    >
      <Text
        color={color ? color : variant === 'outline' ? "blue.500" : "white"}
        fontFamily="heading"
        fontSize={fontSize ?? 'sm'}
      >
        {title}
      </Text>
    </NativeBaseButton>
  )
}