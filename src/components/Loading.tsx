import { Spinner, ISpinnerProps } from "native-base";

export function Loading ({ ...rest }: ISpinnerProps) {
  return (
    <Spinner {...rest} />
  )
}