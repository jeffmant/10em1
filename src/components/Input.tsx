import { FormControl, IInputProps, Input as NativeBaseInput, Text } from 'native-base'

type InputProps = IInputProps & {
  errorMessage?: string
}

export function Input ({errorMessage, isInvalid, ...rest}: InputProps) {
  const invalid = !!errorMessage  || isInvalid
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput 
        bg="gray.700"
        h={16}
        px={4}
        borderWidth={0}
        rounded="xl"
        fontSize="md"
        color="white"
        fontFamily="body"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: "red.500"
        }}
        placeholderTextColor="blue.300"
        _focus={{
          bg: "gray.700",
          borderWidth: 1,
          borderColor: "blue.500"
        }}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage} 
      </FormControl.ErrorMessage>
    </FormControl>
  )
}