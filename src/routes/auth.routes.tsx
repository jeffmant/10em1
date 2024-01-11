import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Signin } from '@screens/Signin';

type AuthRoutes = {
  signin: undefined
}

export type AuthRoutesNavigatiorProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes () {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      
      <Screen 
        name="signin"
        component={Signin}
      />

    </Navigator>
  )
}