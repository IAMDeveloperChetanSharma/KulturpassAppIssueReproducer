import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../../components/button/button'
import { InfoBox } from '../../../../components/info-box/info-box'
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator'
import { SvgImage } from '../../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { cdcApi } from '../../../../services/api/cdc-api'
import { getIsUserLoggedIn, getRegistrationToken } from '../../../../services/auth/store/auth-selectors'
import { ErrorWithCode, UnknownError } from '../../../../services/errors/errors'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { userSlice } from '../../../../services/user/redux/user-slice'
import { useGetAccountInfoLazyQuery } from '../../../../services/user/use-get-account-info-lazy-query'
import { useUserInfo } from '../../../../services/user/use-user-info'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'
import { ErrorAlert } from '../../../form-validation/components/error-alert'

const RESEND_MAIL_VERIFICATION_AFTER_1MIN = 1000 * 60

export const AccountVerificationHero: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const { name } = useUserInfo()
  const regToken = useSelector(getRegistrationToken)
  const [visibleError, setVisibleError] = useState<ErrorWithCode>()
  const timerRef = useRef<NodeJS.Timeout>()
  const [canResend, setCanResend] = useState(true)
  const [accountsResendVerificationCode, result] = cdcApi.endpoints.accountsResendVerificationCode.useLazyQuery()

  const dispatch = useDispatch()
  const getAccountInfoLazyQuery = useGetAccountInfoLazyQuery()

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  const onPressResendVerificationCode = useCallback(async () => {
    if (regToken == null) {
      return
    }

    try {
      const { data } = await getAccountInfoLazyQuery(regToken)

      if (data?.isVerified) {
        dispatch(userSlice.actions.setDisplayVerifiedAlert(true))
        return
      }

      await accountsResendVerificationCode({ regToken })
      setCanResend(false)
      timerRef.current = setTimeout(() => setCanResend(true), RESEND_MAIL_VERIFICATION_AFTER_1MIN)
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        setVisibleError(error)
      } else {
        setVisibleError(new UnknownError())
      }
    }
  }, [accountsResendVerificationCode, regToken, getAccountInfoLazyQuery, dispatch])

  return (
    <>
      <LoadingIndicator loading={result.isLoading} />
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <InfoBox>
        <TranslatedText
          textStyle="HeadlineH4Extrabold"
          textStyleOverrides={{ color: colors.labelColor }}
          testID={buildTestId('account_verification_hero_greeting_text')}
          i18nKey={name ? 'account_verification_hero_greeting' : 'account_verification_hero_greeting_without_name'}
          i18nParams={isLoggedIn ? { name } : undefined}
        />
        <View style={styles.content}>
          {canResend ? (
            <>
              <SvgImage type="mail" width={36} height={36} />
              <TranslatedText
                textStyleOverrides={[styles.text, { color: colors.labelColor }]}
                testID={buildTestId('account_verification_description_text')}
                i18nKey="account_verification_description"
                textStyle="BodySmallMedium"
              />
            </>
          ) : (
            <>
              <SvgImage type="checkmark" width={36} height={36} />
              <TranslatedText
                textStyleOverrides={[styles.text, { color: colors.labelColor }]}
                testID={buildTestId('account_verification_description_success_text')}
                i18nKey="account_verification_description_success"
                textStyle="BodySmallMedium"
              />
            </>
          )}
        </View>

        <Button
          variant="secondary"
          i18nKey={canResend ? 'account_verification_resend' : 'account_verification_resend_disabled'}
          testID={buildTestId('account_verification_resend_button')}
          onPress={onPressResendVerificationCode}
          disabled={!canResend}
          modifier="small"
        />
      </InfoBox>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    marginTop: spacing[2],
    marginBottom: spacing[5],
    flexDirection: 'row',
    flexShrink: 1,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: spacing[2],
  },
})
