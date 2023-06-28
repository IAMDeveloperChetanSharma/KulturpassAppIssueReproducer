import { NavigatorScreenParams, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'

import { RootStackParams } from '../types'
import { ModalParamList } from './types'

export const useModalRoute = <RouteName extends keyof ModalParamList>() =>
  useRoute<StackScreenProps<ModalParamList, RouteName>['route']>()

export const useModalNavigation = () => {
  const nav = useNavigation<StackNavigationProp<RootStackParams>>()

  const navigate = (params: NavigatorScreenParams<ModalParamList>) => {
    nav.navigate('Modal', params)
  }

  const push = (params: NavigatorScreenParams<ModalParamList>) => {
    nav.push('Modal', params)
  }

  const replace = (params: NavigatorScreenParams<ModalParamList>) => {
    nav.replace('Modal', params)
  }

  const closeModal = () => {
    nav.navigate('Tabs', {
      screen: 'Home',
    })
  }

  return { ...nav, navigate, push, replace, closeModal }
}
