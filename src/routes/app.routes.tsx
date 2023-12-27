import { Home } from '@screens/Home';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

type AppRoutes = {
  home: undefined
}

export type AppRoutesNavigatiorProps = NativeStackNavigationProp<AppRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes () {
  return (
    <Navigator 
      screenOptions={{ headerShown: false }}>
      <Screen 
        name="home"
        component={Home}
      />

    </Navigator>
  )
}