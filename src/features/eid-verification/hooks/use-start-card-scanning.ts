import {
  AA2CommandService,
  AA2Messages,
  AA2WorkflowHelper,
  Auth,
  ReaderData,
  Simulator,
} from '@sap/react-native-ausweisapp2-wrapper'
import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { useSelector } from 'react-redux'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'
import {
  AA2AcceptTimeout,
  AA2CardDeactivated,
  AA2SetPinTimeout,
  AA2Timeout,
  extractAuthResultUrlQueryError,
  isTimeoutError,
} from '../errors'
import {
  getRandomLastName,
  getSimulateCard,
  getSimulatedCardDate,
  getSimulatedCardName,
} from '../redux/simulated-card-selectors'
import { Flow } from '../types'
import { generateSimulatedCard } from '../utils'
import { useStartAA2ChangePin } from './use-start-change-pin'

type StartCardScanningParams = {
  flow: Flow
  onPinRetry: (retryCounter?: number) => void
  onCanRetry: (canRetry: boolean) => void
  onPukRetry: (pukRetry: boolean) => void
  pin?: string
  newPin?: string
  can?: string
  puk?: string
  onAuthSuccess: (url: string) => void
  onChangePinSuccess: () => void
  onError: (error: ErrorWithCode) => void
}

/**
 * Returns function to handle the complete scanning process and its edge cases.
 */
export const useStartCardScanning = ({
  flow,
  pin,
  can,
  puk,
  newPin,
  onPinRetry,
  onCanRetry,
  onPukRetry,
  onAuthSuccess,
  onChangePinSuccess,
  onError,
}: StartCardScanningParams) => {
  const simulateCard = useSelector(getSimulateCard)
  const simulatedCardName = useSelector(getSimulatedCardName)
  const simulatedCardDate = useSelector(getSimulatedCardDate)
  const randomLastName = useSelector(getRandomLastName)

  const [isLoading, setIsLoading] = useState(false)

  const startChangePin = useStartAA2ChangePin()

  useEffect(() => {
    if (simulateCard) {
      const simulatedCardDateInst = simulatedCardDate ? new Date(simulatedCardDate) : undefined
      const simulatedCard: Simulator | undefined =
        simulatedCardName !== undefined
          ? generateSimulatedCard(simulatedCardName, simulatedCardDateInst, randomLastName)
          : undefined
      const sub = AA2WorkflowHelper.handleInsertCard(msg => {
        if (msg.error === undefined) {
          AA2CommandService.setCard('Simulator', simulatedCard)
        }
      })
      return () => sub.unsubscribe()
    }
  }, [randomLastName, simulateCard, simulatedCardDate, simulatedCardName])

  const handleAuth = useCallback(
    (authMsg: Auth) => {
      if (authMsg.url !== undefined) {
        /**
         * The Auth workflow succeeded, but the eID backend could still respond
         * with an errorCode in the query parameters.
         * This is not handled by the useHandleErrors hook, as this is no Auth Workflow error.
         */
        const queryError = extractAuthResultUrlQueryError(authMsg)
        if (queryError !== undefined) {
          onError(queryError)
        } else {
          onAuthSuccess(authMsg.url)
        }
      } else {
        throw new Error('Auth message has no url')
      }
    },
    [onAuthSuccess, onError],
  )

  const handleRetry = useCallback(
    async (
      msg: AA2Messages.EnterPin | AA2Messages.EnterCan | AA2Messages.EnterPuk,
      retry: boolean,
      reader?: ReaderData,
    ) => {
      if (Platform.OS === 'ios' && !DeviceInfo.isEmulatorSync()) {
        AA2CommandService.interrupt()
      }
      if (reader?.card?.deactivated === true) {
        onError(new AA2CardDeactivated())
        return
      }
      if (msg === AA2Messages.EnterPin) {
        onPinRetry(reader?.card?.retryCounter)
      } else if (msg === AA2Messages.EnterCan) {
        onCanRetry(retry)
      } else if (msg === AA2Messages.EnterPuk) {
        onPukRetry(retry)
      }
    },
    [onError, onPinRetry, onCanRetry, onPukRetry],
  )

  const enterNewPin = useCallback(async () => {
    if (newPin === undefined) {
      throw new Error('No new PIN provided')
    }

    const changePinResult = await AA2CommandService.setNewPin(simulateCard ? undefined : newPin, {
      msTimeout: AA2_TIMEOUTS.SET_NEW_PIN,
    })
    if (changePinResult.success) {
      onChangePinSuccess()
    }
  }, [newPin, onChangePinSuccess, simulateCard])

  const enterPin = useCallback(async () => {
    try {
      let enteredPin = simulateCard ? undefined : pin
      if (simulateCard && Platform.OS === 'ios' && !DeviceInfo.isEmulatorSync()) {
        // INFO: This is needed as there is some Bug in the AusweisApp2 SDK breaking simulated Cards
        // after an INTERRUPT occured. This is only relevant for real iOS Devices with simulated cards
        enteredPin = pin
      }
      const result = await AA2CommandService.setPin(enteredPin, {
        msTimeout: AA2_TIMEOUTS.SET_PIN,
      })

      if (result.msg === AA2Messages.EnterNewPin) {
        enterNewPin()
      } else if (result.msg === AA2Messages.Auth) {
        handleAuth(result)
      } else {
        handleRetry(result.msg, result.msg === AA2Messages.EnterPin, result.reader)
      }
    } catch (e) {
      if (isTimeoutError(e) && flow === 'Auth') {
        return onError(new AA2SetPinTimeout())
      } else {
        throw e
      }
    }
  }, [enterNewPin, flow, handleAuth, handleRetry, onError, pin, simulateCard])

  const enterCan = useCallback(async () => {
    if (can === undefined) {
      throw new Error('No CAN provided')
    }
    const result = await AA2CommandService.setCan(can, {
      msTimeout: AA2_TIMEOUTS.SET_CAN,
    })
    handleRetry(result.msg, result.msg === AA2Messages.EnterCan, result.reader)
  }, [can, handleRetry])

  const enterPuk = useCallback(async () => {
    if (puk === undefined) {
      throw new Error('No PUK provided')
    }
    const result = await AA2CommandService.setPuk(puk, {
      msTimeout: AA2_TIMEOUTS.SET_PUK,
    })
    handleRetry(result.msg, result.msg === AA2Messages.EnterPuk, result.reader)
  }, [handleRetry, puk])

  /**
   * Used only on the first scanning screen.
   * Accepts the Access Rights and navigates to the next screen after scanning the card.
   */
  const handleInitialAuthScan = useCallback(async () => {
    try {
      const result = await AA2CommandService.accept({
        msTimeout: AA2_TIMEOUTS.ACCEPT,
      })
      handleRetry(result.msg, false, result.reader)
    } catch (error) {
      if (isTimeoutError(error)) {
        onError(new AA2AcceptTimeout())
      } else {
        throw error
      }
    }
  }, [handleRetry, onError])

  /**
   * Used for the first changePin scanning screen.
   * Starts Change Pin and navigates to the next screen after scanning the card.
   */

  /**
   * Used only on the first scanning screen.
   * Accepts the Access Rights and navigates to the next screen after scanning the card.
   */
  const handleInitialChangePinScan = useCallback(async () => {
    const result = await startChangePin()
    handleRetry(result.msg, false, result.reader)
  }, [handleRetry, startChangePin])

  const startScanning = useCallback(async () => {
    setIsLoading(true)
    try {
      // Check the current active Workflow.
      const status = await AA2CommandService.getStatus({
        msTimeout: AA2_TIMEOUTS.GET_STATUS,
      })
      var msg = status.state
      if (status.workflow === null) {
        if (flow === 'ChangePin') {
          // We did not start the ChangePin worklow yet, as this instantly shows the system UI for Card Scanning
          return await handleInitialChangePinScan()
        }
      }

      switch (msg) {
        case AA2Messages.AccessRights:
          return await handleInitialAuthScan()
        case AA2Messages.EnterPin:
          return await enterPin()
        case AA2Messages.EnterCan:
          return await enterCan()
        case AA2Messages.EnterPuk:
          return await enterPuk()
        default:
          throw new Error(`Invalid state ${msg}`)
      }
    } catch (e: unknown) {
      if (
        [
          AA2Messages.BadState,
          AA2Messages.InternalError,
          AA2Messages.Invalid,
          AA2Messages.UnknownCommand,
          AA2Messages.Auth,
          AA2Messages.ChangePin,
          AA2Messages.Reader,
        ].includes((e as any)?.msg)
      ) {
        // AusweisApp2 Message errors are handled by the useHandleErrors hook
        return
      }

      if (isTimeoutError(e)) {
        if (Platform.OS === 'ios' && !simulateCard) {
          // As the Timeout Error is not thrown by the SDK, we need to interrupt the ios scanning dialog
          AA2CommandService.interrupt()
        }
        onError(new AA2Timeout())
      } else {
        onError(new UnknownError())
      }
    } finally {
      setIsLoading(false)
    }
  }, [enterCan, enterPin, enterPuk, flow, handleInitialAuthScan, handleInitialChangePinScan, onError, simulateCard])

  return { startScanning, isLoading }
}
