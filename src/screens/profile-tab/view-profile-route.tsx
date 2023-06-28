import React, { useCallback } from 'react'

import { useModalNavigation } from '../../navigation/modal/hooks'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { ViewProfileScreen } from './view-profile-screen'
import { env } from '../../env'

export const ViewProfileRouteName = 'ViewProfile'

export type ViewProfileRouteParams = undefined

export const ViewProfileRoute: React.FC = () => {
  const tabsNavigation = useTabsNavigation()
  const modalnavigation = useModalNavigation()

  const onPressChangeLanguage = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'ChangeLanguage' })
  }, [tabsNavigation])

  const onPressEditPreferences = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'Preferences' })
  }, [tabsNavigation])

  const onPressUpdateProfile = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'UpdateProfile' })
  }, [tabsNavigation])

  const onPressAppInformations = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'AppInformations' })
  }, [tabsNavigation])

  const onPressContact = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'Contact' })
  }, [tabsNavigation])

  const onPressDeleteAccount = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'DeleteAccount' })
  }, [tabsNavigation])

  const onPressDeveloperMenu = useCallback(() => {
    if (env.DEV_MENU) {
      modalnavigation.navigate({ screen: 'DeveloperMenu' })
    }
  }, [modalnavigation])

  const onPressLogin = useCallback(() => {
    modalnavigation.navigate({
      screen: 'LogIn',
    })
  }, [modalnavigation])

  return (
    <ViewProfileScreen
      onPressChangeLanguage={onPressChangeLanguage}
      onPressEditPreferences={onPressEditPreferences}
      onPressUpdateProfile={onPressUpdateProfile}
      onPressAppInformations={onPressAppInformations}
      onPressContact={onPressContact}
      onPressDeleteAccount={onPressDeleteAccount}
      onPressDeveloperMenu={onPressDeveloperMenu}
      onPressLogin={onPressLogin}
    />
  )
}

export const ViewProfileRouteConfig = createRouteConfig({
  name: ViewProfileRouteName,
  component: ViewProfileRoute,
})
