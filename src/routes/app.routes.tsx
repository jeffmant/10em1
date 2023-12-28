import { Home } from '@screens/Home';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Profile } from '@screens/Profile';

type AppRoutes = {
  home: undefined
  profile: undefined
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

      <Screen 
        name="profile"
        component={Profile}
      />

    </Navigator>
  )
}