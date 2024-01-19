import { Home } from '@screens/Home';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Profile } from '@screens/Profile';
import { Notification } from '@screens/Notification';
import { House, User, TrendUp } from 'phosphor-react-native';
import { Activity } from '@screens/Activity';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

type AppRoutes = {
  home: undefined
  activity: undefined
  profile: undefined
  notification: undefined
}

export type AppRoutesNavigatiorProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes () {
  const { sizes, colors } = useTheme()
  const iconSize = sizes[8]

  return (
    <Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.blue[500],
        tabBarInactiveTintColor: colors.gray[700],
        tabBarStyle: {
          backgroundColor: colors.gray[300],
          position: 'absolute',
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[10],
          borderRadius: 50,
          margin: 16
        }
      }}
    >
      <Screen 
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <House color={color} size={iconSize} />
          ),
        }}
      />

      <Screen 
        name="activity"
        component={Activity}
        options={{
          tabBarIcon: ({ color }) => (
            <TrendUp color={color} size={iconSize} />
          ),
        }}
      />

      <Screen 
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <User color={color} size={iconSize} />
          ),
        }}
      />

      <Screen 
        name="notification"
        component={Notification}
        options={{
          tabBarButton: () => null
        }}
      />

    </Navigator>
  )
}