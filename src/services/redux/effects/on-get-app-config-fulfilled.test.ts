import { Action } from '@reduxjs/toolkit'

import * as enforceAppConfigMinVersionModule from '../../../features/force-update/utils/enforce-app-config-min-version'
import { ErrorWithCode } from '../../errors/errors'
import { configureMockStore } from '../../testing/configure-mock-store'
import { AppConfig, appCoreSlice } from '../slices/app-core'
import { onGetAppConfigFulfilled, onGetAppConfigFulfilledEffect } from './on-get-app-config-fulfilled'

let mockedAppConfig: AppConfig = {
  appVersions: { min: '0.5.55' },
  certificates: {
    cdc: [{ fingerprint256: 'cdc_fingerprint256' }],
    commerce: [{ fingerprint256: 'commerce_fingerprint256' }],
  },
}

jest.mock('../thunks/startup')
jest.mock('../utils/verify-jws-with-jwk', () => ({
  verifyJwsWithJwk: () => Promise.resolve(JSON.stringify(mockedAppConfig)),
}))

describe('on-get-app-config-fulfilled', () => {
  const store = configureMockStore()

  const expectedTriggerAction = {
    meta: { arg: { endpointName: 'getAppConfig' } },
    payload: 'new initialValue',
    type: 'commerceApi/executeQuery/fulfilled',
  }

  const enforceAppConfigMinVersion = jest
    .spyOn(enforceAppConfigMinVersionModule, 'enforceAppConfigMinVersion')
    .mockImplementation(() => {})

  afterEach(() => {
    store.clearActions()
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('onGetAppConfigFulfilled', () => {
    it('should match with setEnvironmentConfiguration action', async () => {
      let effectDefinition: any

      onGetAppConfigFulfilled(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect = effectDefinition.matcher(expectedTriggerAction)

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onGetAppConfigFulfilledEffect', () => {
    it('should call enforceAppConfigMinVersion', async () => {
      await onGetAppConfigFulfilledEffect(expectedTriggerAction as any, store as any)

      expect(enforceAppConfigMinVersion).toBeCalledWith(mockedAppConfig)
    })

    it('should dispatch setAppConfig thunk', async () => {
      await onGetAppConfigFulfilledEffect(expectedTriggerAction as any, store as any)

      store.expectActions([{ type: appCoreSlice.actions.setAppConfig.type, payload: mockedAppConfig }])
    })

    it('should should throw ErrorWithCode if appConfigString is not JSON-parsable', async () => {
      mockedAppConfig = 'not a parsable JSON' as any as AppConfig

      const promise = onGetAppConfigFulfilledEffect(expectedTriggerAction as any, store as any)

      await expect(promise).rejects.toThrow(ErrorWithCode)
    })

    it('should should throw ErrorWithCode if appConfig schema is not correct', async () => {
      mockedAppConfig = {
        certificates: {
          cdc: [{ fingerprint256: 'cdc_fingerprint256' }],
          commerce: [{ fingerprint256: 'commerce_fingerprint256' }],
        },
      } as AppConfig

      const promise = onGetAppConfigFulfilledEffect(expectedTriggerAction as any, store as any)

      await expect(promise).rejects.toThrow(ErrorWithCode)
    })
  })
})
