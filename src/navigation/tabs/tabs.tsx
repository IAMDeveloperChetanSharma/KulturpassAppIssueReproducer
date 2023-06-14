import React, { useCallback } from 'react'
import { BottomTabBarProps, BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { FavoritesRouteConfig } from '../../screens/favorites/favorites-route'
import { HomeRouteConfig } from '../../screens/home/home-route'
import { ReservationsRouteConfig } from '../../screens/reservations/reservations-route'
import { SearchRouteConfig } from '../../screens/search/search-route'
import { SettingsStack, SettingsStackInitialRouteName } from './settings/settings-stack'
import { TabsParamList } from './types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomTabBar } from './bottom-tab-bar'

const BottomTab = createBottomTabNavigator<TabsParamList>()

export const Tabs: React.FC = () => {
  const { bottom } = useSafeAreaInsets()

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
  }

  const renderTabBar = useCallback<React.FC<BottomTabBarProps>>(
    props => <BottomTabBar {...props} bottomSafeArea={bottom} />,
    [bottom],
  )

  return (
    <BottomTab.Navigator tabBar={renderTabBar} screenOptions={screenOptions}>
      <BottomTab.Screen name={HomeRouteConfig.name} component={HomeRouteConfig.component} />
      <BottomTab.Screen name={SearchRouteConfig.name} component={SearchRouteConfig.component} />
      <BottomTab.Screen name={ReservationsRouteConfig.name} component={ReservationsRouteConfig.component} />
      <BottomTab.Screen name={FavoritesRouteConfig.name} component={FavoritesRouteConfig.component} />
      <BottomTab.Screen
        name="Settings"
        component={SettingsStack}
        // eslint-disable-next-line react/jsx-no-bind
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault()

            // navigate to the initial settings screen
            navigation.navigate('Settings', {
              screen: SettingsStackInitialRouteName,
            })
          },
        })}
      />
    </BottomTab.Navigator>
  )
}
