import { renderHook } from '@testing-library/react-native'
import { Price } from '../../../services/api/types/commerce/api-types'
import { useFormattedPrice } from './use-formatted-price'
import { translation } from '../../../services/translation/translation'

describe('useFormattedPrice', () => {
  beforeEach(() => {
    translation.changeLanguage('de')
  })

  test('Should return formatted EUR price', () => {
    const price: Price = {
      value: 20,
      currencyIso: 'EUR',
    }
    const { result } = renderHook(() => useFormattedPrice(price))

    expect(result.current).toMatch(/20,00\s€/)
  })

  test('Should return undefined', () => {
    const price: Price = {
      value: undefined,
      currencyIso: 'EUR',
    }
    const { result } = renderHook(() => useFormattedPrice(price))
    expect(result.current).toBeUndefined()
  })
})
