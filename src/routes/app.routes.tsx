import { Home } from '@screens/Home';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Notification } from '@screens/Notification';
import { ChartDonut, Target, Gear } from 'phosphor-react-native';
import { Activity } from '@screens/Activity';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';
import { Settings } from '@screens/Settings';
import { About } from '@screens/About';

type AppRoutes = {
  home: undefined
  activity: undefined
  settings: undefined
  notification: undefined
  about: undefined
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
          height: Platform.OS === 'android' ? 'auto' : 76,
          paddingBottom: sizes[8],
          paddingTop: sizes[8],
          borderRadius: 50,
          margin: 32,
        }
      }}
    >
      <Screen 
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Target color={color} size={iconSize} />
          ),
        }}
      />

      <Screen 
        name="activity"
        component={Activity}
        options={{
          tabBarIcon: ({ color }) => (
            <ChartDonut color={color} size={iconSize} />
          )
        }}
      />

      <Screen 
        name="settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <Gear color={color} size={iconSize} />
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

      <Screen 
        name="about"
        component={About}
        options={{
          tabBarButton: () => null
        }}
      />

    </Navigator>
  )
}