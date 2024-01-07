import { Home } from '@screens/Home';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Profile } from '@screens/Profile';
import { Notification } from '@screens/Notification';

type AppRoutes = {
  home: undefined
  profile: undefined
  notification: undefined
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

      <Screen 
        name="notification"
        component={Notification}
      />

    </Navigator>
  )
}