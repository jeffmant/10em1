import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";
import { SignedIn, SignedOut, useSession } from "@clerk/clerk-expo";
import { AuthRoutes } from "./auth.routes";

export function Routes () {
  const { colors } = useTheme()
  const { isSignedIn } = useSession()

  const theme = DefaultTheme;
  theme.colors.background = isSignedIn ? colors.gray['200'] : "#1B1B1F"

  return (
    <Box flex={1} bg={ isSignedIn ? "gray.200" : "#1B1B1F"}>
      <NavigationContainer theme={theme}>
        <SignedIn>
            <AppRoutes />
        </SignedIn>
        <SignedOut>
            <AuthRoutes />
        </SignedOut>
      </NavigationContainer>
    </Box>
  )
}