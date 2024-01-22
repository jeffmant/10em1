import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { UserProvider } from '@realm/react'
import { RealmProvider, syncConfig } from "../libs/realm";
import { Loading } from "@components/Loading";

export function Routes () {
  const { colors } = useTheme()

  const theme = DefaultTheme;
  theme.colors.background = colors.gray['200']

  return (
    <Box flex={1} bg="gray.200">
      <NavigationContainer theme={theme}>
        <UserProvider fallback={AuthRoutes}>
          <RealmProvider 
            sync={syncConfig} 
            fallback={<Loading />}
          >
            <AppRoutes />
          </RealmProvider>
        </UserProvider>
      </NavigationContainer>
    </Box>
  )
}