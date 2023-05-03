import { getEnvironmentConfigurationCdc } from '../../environment-configuration/redux/environment-configuration-selectors'
import { RootState } from '../../redux/configure-store'
import { CreateQueryFn } from '../common/types'
import { calculateSignature } from '../utils/calculate-signature'
import { appendCdcDefaultParameters } from './append-cdc-default-parameters'
import { buildCdcApiUrl } from './build-cdc-api-url'
import { encodeBodyPayload } from '../utils/encode-body-payload'
import { sendCdcPostRequest } from './send-cdc-post-request'

export const callCdcWithCustomSessionInfoSigned: CreateQueryFn<{
  path: string
  bodyPayload?: Record<string, any>
  sessionToken: string
  sessionSecret: string
}> = prepare => async (arg, api, extraOptions, baseQuery) => {
  const rootState = api.getState() as RootState
  const cdcEnvConfig = getEnvironmentConfigurationCdc(rootState)

  const prepared = prepare(arg, api)
  if (!prepared.bodyPayload) {
    prepared.bodyPayload = {}
  }

  const url = buildCdcApiUrl(prepared.path, rootState)

  const bodyPayload = appendCdcDefaultParameters(prepared.bodyPayload)
  bodyPayload.apiKey = cdcEnvConfig.apiKey
  bodyPayload.oauth_token = prepared.sessionToken

  const bodyPayloadWithEncodedValues = encodeBodyPayload(bodyPayload)
  bodyPayloadWithEncodedValues.sig = calculateSignature(
    prepared.sessionSecret,
    'POST',
    url,
    bodyPayloadWithEncodedValues,
  )

  return sendCdcPostRequest(url, bodyPayloadWithEncodedValues, api, extraOptions, baseQuery)
}
