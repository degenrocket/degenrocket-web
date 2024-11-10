import {ref, readonly} from "vue";
import {ethers, JsonRpcApiProvider, JsonRpcSigner} from "ethers";
import {
  PostSignature,
  Web3Message,
  Web3MessageAction,
  NostrEvent,
  SpasmEventBodyV2,
  SpasmEventIdV2,
  SpasmEventBodySignedClosedV2,
  SpasmEventV2,
  SpasmEventEnvelopeV2,
  // NostrEventSignedOpened,
  NostrSpasmEventSignedOpened,
  NostrSpasmEvent,
  NostrEventSignedOpened
} from "@/helpers/interfaces";
import { bech32 } from 'bech32'
import { validateEvent, verifySignature, getSignature, getEventHash } from 'nostr-tools'
// import detectEthereumProvider from '@metamask/detect-provider'
import DOMPurify from 'dompurify';
import { spasm } from 'spasm.js'
import { useUtils } from './useUtils';
import { useNostr } from './useNostr';
const {
  hasValue,
  // isValidSpasmEventV2,
  // areValidSpasmEventsV2,
  isArrayWithValues,
  isObjectWithValues,
  isStringOrNumber,
  toBeString
} = useUtils()
const {
  sendEventToNostrNetwork,
  toBeHex,
  toBeNote
} = useNostr()

const isWeb3ModalShown = ref(false)
const isQrCodeModalShown = ref(false)
const pendingAuthentication = ref(false)
const isMultiSign = ref(false)
const isNetworkSpasmSelected = ref(true)
const isNetworkNostrSelected = ref(false)
const qrCodeValue = ref<string | undefined>('')
let provider: JsonRpcApiProvider | undefined
let signer: JsonRpcSigner | undefined
const connectedAddress = ref<string | undefined>('')
const connectedAddressNostr = ref<string | undefined>('')
const connectedAddressEthereum = ref<string | undefined>('')
const connectedKeyType =
  ref<"ethereum" | "nostr" | "" | null | undefined>(null)
// const assembledMessage = ref({})
const savedSpasmEventBodyV2: Ref<SpasmEventBodyV2 | null> =
  ref(null)
const spasmEventSignedWithEthereum: Ref<SpasmEventV2 | null> =
  ref(null)
const spasmEventSignedWithNostr: Ref<SpasmEventV2 | null> =
  ref(null)
const savedMergedMultiSignedSpasmEventV2:
  Ref<SpasmEventV2 | null> = ref(null)

export const useWeb3 = () => {
  const showWeb3Modal = (): void => {
    isWeb3ModalShown.value = true
    // console.log("isWeb3ModalShown:", isWeb3ModalShown.value)
  }

  const hideWeb3Modal = (): void => {
    isWeb3ModalShown.value = false
    // console.log("isWeb3ModalShown:", isWeb3ModalShown.value)
  }

  const showQrCodeModal = (): void => {
    isQrCodeModalShown.value = true
  }

  const hideQrCodeModal = (): void => {
    isQrCodeModalShown.value = false
  }

  const setQrCodeValue = (value?: string): void => {
    if (value && typeof(value) === "string") {
      qrCodeValue.value = value
    }
  }

  const selectNetworkSpasm = (): void => {
    isNetworkSpasmSelected.value = true
  }

  const deselectNetworkSpasm = (): void => {
    isNetworkSpasmSelected.value = false
  }

  const selectNetworkNostr = (): void => {
    isNetworkNostrSelected.value = true
  }

  const deselectNetworkNostr = (): void => {
    isNetworkNostrSelected.value = false
  }

  const turnOnMultiSign = (): void => {
    isMultiSign.value = true
  }

  const turnOffMultiSign = (): void => {
    isMultiSign.value = false
  }

  const connectWeb3Authenticator = async (): Promise<boolean> => {
    pendingAuthentication.value = true
    try {
      await detectProvider()
      await setSigner()
      const accounts: JsonRpcSigner[] | undefined = await listAccounts()

      if (Array.isArray(accounts) &&
        typeof (accounts?.[0]?.address) === 'string') {
        setConnectedAddress(accounts?.[0]?.address, 'ethereum')
        pendingAuthentication.value = false
        return true
      } else {
        pendingAuthentication.value = false
        return false
      }
    } catch (err) {
      console.error(err)
      pendingAuthentication.value = false
      return false
    }
  }

  const detectProvider = async (): Promise<boolean> => {
    // provider.value = await detectEthereumProvider()
    // TODO use RPC provider if BrowserProvider is not detected
    if (window?.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum)
      return provider ? true : false
    }
    isWeb3ModalShown.value = true
    return false
  }

  // provider.getSigner() prompts a user to connect an account
  const setSigner = async (): Promise<void> => {
    signer = await provider?.getSigner()
  }

  const setRandomSigner = (): void => {
    // console.log("setSigner called")
    signer = ethers.Wallet.createRandom()
    setConnectedAddress(signer?.address, 'ethereum')
  }

  // provider.getSigner() prompts a user to connect an account
  const getSigner = async (): Promise<JsonRpcSigner | undefined> => {
    // console.log("signer:", signer)
    signer = await provider?.getSigner()
    return signer
  }

  // provider.listAccounts() returns an array of accounts
  // only if a user is already authenticated (approved connection).
  const listAccounts = async (): Promise<JsonRpcSigner[]> => {
    try {
      // console.log("listAccounts called")
      const accounts = await provider?.listAccounts()
      // console.log("accounts:", accounts)
      setConnectedAddress(accounts?.[0]?.address, 'ethereum')
      return accounts ? accounts : []
    } catch (error) {
      // User denied account access
      console.error(error)
      setConnectedAddress('','')
      return []
    }
  }

  const setConnectedAddress = (address?: string, keyType?: string): boolean => {
    resetMultiSigning()
    // type can be 'ethereum', 'nostr', etc.
    keyType = keyType ?? 'ethereum'

    if (address && typeof (address) === 'string') {
      connectedAddress.value = address
      connectedKeyType.value = keyType
      if (keyType === "ethereum") {
        connectedAddressEthereum.value = address
      } else if (keyType === "nostr") {
        connectedAddressNostr.value = address
      }
      return true
    } else {
      connectedAddress.value = ""
      connectedKeyType.value = ""
      return false
    }
  }

  const disconnectAccount = (): void => {
    connectedAddress.value = ""
    connectedKeyType.value = ""
    connectedAddressEthereum.value = ""
    connectedAddressNostr.value = ""
    signer = undefined
    provider = undefined
  }

  const resetMultiSigning = (): void => {
    spasmEventSignedWithEthereum.value = null
    spasmEventSignedWithNostr.value = null
    savedMergedMultiSignedSpasmEventV2.value = null
  }

  const removeAddressEthereum = (): void => {
    connectedAddressEthereum.value = ""
    resetMultiSigning()
  }

  const removeAddressNostr = (): void => {
    connectedAddressNostr.value = ""
    resetMultiSigning()
  }

  interface SubmitActionReturn {
    res: string | boolean | null | undefined,
    signature: string | undefined
  }

  interface SubmitEventV2Return {
    res: string | boolean | null | undefined,
    id?: string | number
    // signature: string | undefined
  }

  const assembleSpasmEventBodyV2 = (
    dirtyAction: Web3MessageAction,
    dirtyContent?: string,
    dirtyParentIds?: (string | number) | (string | number)[],
    dirtyTitle?: string
  ): SpasmEventBodyV2 | null => {
    savedSpasmEventBodyV2.value = null
    if (!toBeString(dirtyAction)) return null
    const action = DOMPurify.sanitize(toBeString(dirtyAction)) as Web3MessageAction
    if (!action) return null
    let content = DOMPurify.sanitize(toBeString(dirtyContent))
    const title = DOMPurify.sanitize(toBeString(dirtyTitle))
    if (action === "react") {
      content = content.toLowerCase()
    }

    // Concat converts string or number into array
    let parentIds: (string | number)[] = []
    if (dirtyParentIds) {
      parentIds = parentIds.concat(dirtyParentIds)
    }
    // spasm.sanitizeEvent() can also sanitize an array
    spasm.sanitizeEvent(parentIds)

    const spasmEventBodyV2: SpasmEventBodyV2 = {
      type: "SpasmEventBodyV2"
    }

    if (action && typeof(action) === "string") {
      spasmEventBodyV2.action = action
    }

    if (content && typeof(content) === "string") {
      spasmEventBodyV2.content = content
    }

    if (title && typeof(title) === "string") {
      spasmEventBodyV2.title = title
    }

    const finalParentIds: SpasmEventIdV2[] = []
    if (parentIds && isArrayWithValues(parentIds)) {
      parentIds.forEach(parentId => {
        if (isStringOrNumber(parentId)) {
          finalParentIds.push({ value: parentId })
        }
      })
    }

    // TODO tbc add parent authors to mentions
    if (isArrayWithValues(finalParentIds)) {
      spasmEventBodyV2.parent = { ids: finalParentIds }
    }

    spasmEventBodyV2.timestamp = Date.now()
    spasmEventBodyV2.license = 'SPDX-License-Identifier: CC0-1.0'
    spasmEventBodyV2.protocol = {
      name: "spasm", version: "2.0.0"
    }

    // Advanced multi-signing
    if (isMultiSign) {
      spasmEventBodyV2.authors ??= []
      spasmEventBodyV2.authors[0] ??= {}
      spasmEventBodyV2.authors[0].addresses ??= []
      if (
        connectedAddressEthereum.value &&
        typeof(connectedAddressEthereum.value) === "string"
      ) {
        spasmEventBodyV2.authors[0].addresses.push({ 
          // value: connectedAddressEthereum.value,
          value: connectedAddressEthereum.value.toLowerCase(),
          format: { name: "ethereum-pubkey" }
        })
      }
      if (
        connectedAddressNostr.value &&
        typeof(connectedAddressNostr.value) === "string"
      ) {
        spasmEventBodyV2.authors[0].addresses.push({ 
          // value: toBeHex(connectedAddressNostr.value),
          value: toBeHex(connectedAddressNostr.value)
            .toLowerCase(),
          format: { name: "nostr-hex" }
        })
      }
    // Default single signing
    } else {
      if (
        !connectedAddress.value
        // !connectedAddress.value &&
        // !signer?.address &&
        // !connectedAddressEthereum.value &&
        // !connectedAddressNostr.value
      ) return null
      // const signerAddress = signer?.address?.toLowerCase()
      const signerAddress = connectedAddress.value
      if (!signerAddress) return null
      spasmEventBodyV2.authors ??= []
      if (spasmEventBodyV2.authors[0]) {
        spasmEventBodyV2.authors[0].addresses ??= []
        if (connectedKeyType.value === "ethereum") {
          spasmEventBodyV2.authors[0].addresses.push({ 
            value: signerAddress,
            format: { name: "ethereum-pubkey" }
          })
        } else if (connectedKeyType.value === "nostr") {
          spasmEventBodyV2.authors[0].addresses.push({ 
            value: toBeHex(signerAddress),
            format: { name: "nostr-hex" }
          })
        }
      } else {
        if (connectedKeyType.value === "ethereum") {
          spasmEventBodyV2.authors = [{
            addresses: [{
              value: signerAddress,
              format: { name: "ethereum-pubkey" }
            }]
          }]
        } else if (connectedKeyType.value === "nostr") {
          spasmEventBodyV2.authors = [{
            addresses: [{
              value: toBeHex(signerAddress),
              format: { name: "nostr-hex" }
            }]
          }]
        }
      }
    }

    if (isObjectWithValues(spasmEventBodyV2)) {
      savedSpasmEventBodyV2.value = spasmEventBodyV2
      return spasmEventBodyV2
    } else {
      return null
    }
  }

  const signSpasmEventBodyV2 = async (
    spasmEventBodyV2: SpasmEventBodyV2,
    signWith?: "ethereum" | "nostr"
  ): Promise<SpasmEventV2 | null> => {
    if (
      !spasmEventBodyV2 ||
      !isObjectWithValues(spasmEventBodyV2)
    ) { return null }
    if (!signWith) {
      if (
        connectedKeyType.value &&
        typeof(connectedKeyType.value) === "string" &&
        (
          connectedKeyType.value === "ethereum" ||
          connectedKeyType.value === "nostr"
        )
      ) { signWith = connectedKeyType.value }
    }
    if (!signWith) { return null }

    if (signWith === "ethereum") {
      const eventSigned =
        await signSpasmEventBodyV2WithEthereum(spasmEventBodyV2)
      if (eventSigned) { return eventSigned }
    } else if (signWith === "nostr") {
      const eventSigned =
        await signSpasmEventBodyV2WithNostr(spasmEventBodyV2)
      if (eventSigned) { return eventSigned }
    }
    return null
  }

  const signSpasmEventBodyV2WithEthereum = async (
    spasmEventBodyV2: SpasmEventBodyV2
  ): Promise<SpasmEventV2 | null> => {
    spasmEventSignedWithEthereum.value = null
    if (
      !spasmEventBodyV2 ||
      !isObjectWithValues(spasmEventBodyV2)
    ) { return null }
    try {
      const stringToSign: string =
        JSON.stringify(spasmEventBodyV2)
      if (!stringToSign) return null

      // sign the message
      const signature: string | null =
        await signString(stringToSign)
      if (!signature) return null

      if (!signer?.address) return null
      const signerAddress = signer?.address?.toLowerCase()
      if (!signerAddress) return null

      // verify the signature
      const isSignatureValid: boolean = verifyEthereumSignature(
        stringToSign, signature, signerAddress
      )
      if (!isSignatureValid) return null

      const signedEvent: SpasmEventBodySignedClosedV2 = {
        type: "SpasmEventBodySignedClosedV2",
        signedString: stringToSign,
        signature,
        signer: signerAddress
      }

      const spasmEvent: SpasmEventV2 =
        spasm.convertToSpasm(signedEvent)
      if (spasmEvent) {
        spasmEventSignedWithEthereum.value = spasmEvent
        return spasmEvent
      } else {
        return null
      }
    } catch (err) {
      console.error(err);
      return null
    }
  }

  const signSpasmEventBodyV2WithNostr = async (
    spasmEventBodyV2: SpasmEventBodyV2
  ): Promise<SpasmEventV2 | null> => {
    spasmEventSignedWithNostr.value = null
    if (
      !spasmEventBodyV2 ||
      !isObjectWithValues(spasmEventBodyV2)
    ) { return null }
    try {
      const nostrEventUnsigned: NostrSpasmEvent =
        spasm.convertToNostr(spasmEventBodyV2)
      if (!nostrEventUnsigned) return null

      // add ID to Nostr event
      nostrEventUnsigned.id = getEventHash(nostrEventUnsigned)
      const nostrEventSigned: NostrSpasmEventSignedOpened =
        await window.nostr.signEvent(nostrEventUnsigned)

      // verify the signature
      if (!nostrEventSigned.sig) return null
      const isSignatureValid: boolean =
        verifySignature(nostrEventSigned)
      if (!isSignatureValid) return null

      const spasmEvent: SpasmEventV2 =
        spasm.convertToSpasm(nostrEventSigned)

      if (spasmEvent && isObjectWithValues(spasmEvent)) {
        spasmEventSignedWithNostr.value = spasmEvent
        return spasmEvent
      } else { return null }
    } catch (err) {
      console.error(err);
      return null
    }
  }

  const sendEventV2ToNetworks = async (
    event: SpasmEventV2,
    sendTo: ("spasm" | "nostr")[] = ["spasm"]
  ): Promise<string | boolean | null | undefined> => {
    if (!event || !isObjectWithValues(event)) return null
    if (!sendTo || !isArrayWithValues(sendTo)) return null
    try {
      if (sendTo && isArrayWithValues(sendTo)) {
        if (sendTo?.includes("nostr")) {
          sendEventToNostrNetwork(event)
        }
        if (sendTo?.includes("spasm")) {
          return sendEventV2ToSpasm(event)
        }
      }
    } catch (err) {
      console.error(err);
      return null
    }
    return null
  }

  const sendEventV2ToSpasm = async (
    event:
      SpasmEventBodySignedClosedV2 |
      NostrSpasmEventSignedOpened |
      SpasmEventV2
  ): Promise<string | boolean | null | undefined> => {
    if (!event || !isObjectWithValues(event)) return null
    try {
      const {apiURL} = useRuntimeConfig()?.public

      const envelope: SpasmEventEnvelopeV2 | null =
        spasm.convertToSpasmEventEnvelope(event, "2.0.0")
      if (!envelope) return null

      const path = `${apiURL}/api/submit/`

      const res: string | boolean | null | undefined =
        await $fetch(path, {
        method: 'POST',
        body: envelope
      });

      return res

    } catch (err) {
      console.error(err)
      return null
    }
  }

  const submitMultiSignedEventV2 = async (
  ): Promise<SubmitEventV2Return | null> => {
    if (!savedMergedMultiSignedSpasmEventV2.value) {
      return null
    }
    const signedEvent: SpasmEventV2 =
      savedMergedMultiSignedSpasmEventV2.value
    if (!signedEvent) return null

    // broadcast event
    const sendTo: ("spasm" | "nostr")[] = []
    if (isNetworkSpasmSelected.value) { sendTo.push("spasm") }
    if (
      // Currently, Spasm reactions are converted to Nostr kind 1
      // events, so they aren't broadcasted to the Nostr network.
      isNetworkNostrSelected.value &&
      signedEvent.action !== "react"
    ) { sendTo.push("nostr") }
    const res: string | boolean | null | undefined =
      await sendEventV2ToNetworks(signedEvent, sendTo)

    // ID is returned so a user can be redirected
    // to a newly created post or a comment/reply
    const id = spasm.extractIdByFormat(signedEvent, {
      name: "spasmid"
    })
    if (res) {
      if (id && typeof(id) === "string") {
        return { res, id }
      } else { return { res } }
    } else { return null }
  }

  const submitSingleSignedEventV2 = async (
    dirtyAction: Web3MessageAction,
    dirtyContent?: string,
    dirtyParentIds?: (string | number) | (string | number)[],
    dirtyTitle?: string
  ): Promise<SubmitEventV2Return | null> => {
    // Only try to connect an Ethereum extension.
    // If web3 (Ethereum) is not detected, then the web3
    // modal with different connect options will be shown.
    // if (!signer) { await connectWeb3Authenticator() }
    if (!connectedAddress.value) {
      await connectWeb3Authenticator()
    }

    // assemble event
    const spasmEventBodyV2: SpasmEventBodyV2 | null =
      assembleSpasmEventBodyV2(
        dirtyAction, dirtyContent, dirtyParentIds, dirtyTitle
    )
    if (!spasmEventBodyV2) return null

    // sign event
    const signedEvent: SpasmEventV2 | null =
      await signSpasmEventBodyV2(spasmEventBodyV2)
    if (!signedEvent) return null

    // broadcast event
    const sendTo: ("spasm" | "nostr")[] = []
    if (isNetworkSpasmSelected.value) { sendTo.push("spasm") }
    if (
      // Currently, Spasm reactions are converted to Nostr kind 1
      // events, so they aren't broadcasted to the Nostr network.
      isNetworkNostrSelected.value && dirtyAction !== "react"
    ) { sendTo.push("nostr") }
    const res: string | boolean | null | undefined =
      await sendEventV2ToNetworks(signedEvent, sendTo)

    // ID is returned so a user can be redirected
    // to a newly created post or a comment/reply
    const id = spasm.extractIdByFormat(signedEvent, {
      name: "spasmid"
    })
    if (res) {
      if (id && typeof(id) === "string") {
        return { res, id }
      } else { return { res } }
    } else { return null }
  }

  const signMessageWithEthereum = async (
    dirtyAction: Web3MessageAction,
    dirtyContent?: string,
    dirtyParentIds?: (string | number) | (string | number)[],
    dirtyTitle?: string
  ): Promise<void | null> => {
    // Only try to connect an Ethereum extension.
    // If web3 (Ethereum) is not detected, then the web3
    // modal with different connect options will be shown.
    // if (!signer) { await connectWeb3Authenticator() }
    if (!connectedAddress.value) {
      await connectWeb3Authenticator()
    }

    // assemble Spasm Body V2
    const spasmEventBodyV2: SpasmEventBodyV2 | null =
      assembleSpasmEventBodyV2(
        dirtyAction, dirtyContent, dirtyParentIds, dirtyTitle
    )

    if (!spasmEventBodyV2) return null

    // sign event
    const signedEvent: SpasmEventV2 | null =
      await signSpasmEventBodyV2(spasmEventBodyV2, "ethereum")
    if (!signedEvent) return null
  }

  const signSavedMessageWithNostr = async (
  ): Promise<void | null> => {
    if (!savedSpasmEventBodyV2.value) { return null }
    const spasmEventBodyV2: SpasmEventBodyV2 | null =
      savedSpasmEventBodyV2.value
    if (!spasmEventBodyV2) return null
    // sign event
    const signedEvent: SpasmEventV2 | null =
      await signSpasmEventBodyV2(spasmEventBodyV2, "nostr")
    if (!signedEvent) return null
    if (!spasmEventSignedWithEthereum.value) return null
    const mergedEvent: SpasmEventV2 | null =
      spasm.mergeSpasmEventsV2(
        [signedEvent, spasmEventSignedWithEthereum.value]
    )
    if (mergedEvent && isObjectWithValues(mergedEvent)) {
      savedMergedMultiSignedSpasmEventV2.value = mergedEvent
    }
  }

  const submitAction = async (
    action?: Web3MessageAction,
    text?: string,
    target?: string,
    title?: string
  ): Promise<SubmitActionReturn | false> => {
    // Only try to connect an Ethereum extension.
    // If web3 (Ethereum) is not detected, then the web3
    // modal with different connect options will be shown.
    // if (!signer) { await connectWeb3Authenticator() }
    if (!connectedAddress.value) { await connectWeb3Authenticator() }

    if (action && typeof(action) === "string") {
      action = DOMPurify.sanitize(action) as Web3MessageAction
    }
    
    if (text && typeof(text) === "string") {
      text = DOMPurify.sanitize(text)
    }

    if (target && typeof(target) === "string") {
      target = DOMPurify.sanitize(target)
    }

    if (title && typeof(title) === "string") {
      title = DOMPurify.sanitize(title)
    }

    if (connectedKeyType.value === 'ethereum') {
      return submitEthereumAction(action, text, target, title)
    } else if (connectedKeyType.value === 'nostr') {
      return submitNostrAction(action, text, target, title)
    } else {
      return false
    }
  }

  const submitEthereumAction = async (action?: Web3MessageAction, text?: string, target?: string, title?: string): Promise<SubmitActionReturn | false> => {
    try {
      // assemble JSON object for signing
      const web3MessageJson: Web3Message = assembleActionIntoJSON(action, text, target, title)
      // console.log("web3Message:", web3MessageJson)

      const stringToSign: string = JSON.stringify(web3MessageJson)
      // console.log("stringToSign:", stringToSign)

      // sign the message
      const signature: string | null = await signString(stringToSign)

      if (!signature) return false
      if (!signer?.address) return false
      const signerAddress = signer.address.toLowerCase()

      // verify the signature
      const isSignatureValid: boolean = verifyEthereumSignature(stringToSign, signature, signer?.address)
      // console.log("isSignatureValid:", isSignatureValid)

      if (!isSignatureValid) return false

      // send data to backend
      const res: string | boolean | null | undefined = await submitSignature(stringToSign, signature, signerAddress)

      // signature is returned so a user can be redirected
      // to a newly created post or a comment/reply
      return { res, signature}

    } catch (err) {
      console.error('submitAction failed:', err)
      return false
    }
  }

  const submitNostrAction = async (action?: Web3MessageAction, text?: string, target?: string, title?: string): Promise<SubmitActionReturn | false> => {
    if (!action) return false
    if (!text) return false
    if (!connectedAddress.value) return false

    try {
      // assemble JSON object for signing
      const nostrEventJson: NostrEvent = await assembleActionIntoNostrJson(action, text, target, title)

      // add ID to Nostr event
      nostrEventJson.id = getEventHash(nostrEventJson)

      // sign the message
      // const signature: string | undefined = await signString(stringToSign)
      // TODO: "nostr-tools: `signEvent` is deprecated and will
      // be removed or changed in the future.
      // Please use `getSignature` instead."
      // However, two options below don't work.
      // const signedNostrEvent: NostrEvent = await window.nostr.getSignature(nostrEventJson)
      // const signedNostrEvent: NostrEvent = await getSignature(nostrEventJson)
      const signedNostrEvent: NostrEvent = await window.nostr.signEvent(nostrEventJson)

      const signature = signedNostrEvent.sig

      if (!signature) return false
      // if (!signer?.address) return false
      // const signerAddress = signer.address.toLowerCase()

      // verify the signature
      const isSignatureValid: boolean = verifySignature(signedNostrEvent)

      if (!isSignatureValid) return false

      // send data to backend
      // const res: string | boolean | null | undefined = await submitSignature(stringToSign, signature, signerAddress)
      const res: string | boolean | null | undefined = await submitNostrSignature(signedNostrEvent)

      // signature is returned so a user can be redirected
      // to a newly created post or a comment/reply
      return { res, signature}

    } catch (err) {
      console.error('submitAction failed:', err)
      return false
    }
  }

  const signString = async (stringToSign: string): Promise<string | null> => {
    // TODO: delete signer, because use connectWeb3Authenticator
    if (!signer) { signer = await provider?.getSigner() }

    const message = stringToSign
    // console.log("message:", message)
    let signature: string | undefined | null

    try {
      signature = await signer?.signMessage(message)
      // console.log("signature:", signature)

      if (
        signature && typeof(signature) === "string"
      ) { return signature } else { return null }

    } catch (err) {
      console.error('signString failed', err)
      return null
    }
  }

  const verifyEthereumSignature = (messageString: string, signature: string, signerAddress: string): boolean => {

    if (signature && typeof (signature) === 'string') {
      const recoveredAddress = ethers.verifyMessage(messageString, signature)
      // console.log("recoveredAddress:", recoveredAddress)
      // console.log("signerAddress:", signerAddress)
      // console.log(recoveredAddress === signerAddress)

      return recoveredAddress.toLowerCase() === signerAddress.toLowerCase()
    }

    return false
  }

  const assembleActionIntoJSON = (action?: Web3MessageAction, text?: string, target?: string, title?: string): Web3Message => {
    // Change uppercase reactions such as 'Bullish' to 'bullish'
    if (action === 'react') {
      text = text?.toLowerCase()
    }
    return {
      version: 'dmp_v0.1.0',
      time: new Date(Date.now()).toISOString(),
      action,
      target,
      title,
      text,
      // license: 'MIT'
      license: 'SPDX-License-Identifier: CC0-1.0'
    }
  }

  const assembleActionIntoNostrJson = async (action: Web3MessageAction, text: string, target?: string, title?: string): Promise<NostrEvent> => {
    // Change uppercase reactions such as 'Bullish' to 'bullish'
    if (action === 'react') {
      text = text?.toLowerCase()
    }

    const nostrPublicKey: string = await window.nostr.getPublicKey()

    const spasmVersion = "1.0.0"

    // const spasmLicense = "MIT"
    const spasmLicense = "SPDX-License-Identifier: CC0-1.0"

    let nostrEvent = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        [
          "license", spasmLicense
        ],
        [
          "spasm_version", spasmVersion
        ],
        // [
        //   "spasm_target", target
        // ],
        [
          "spasm_action", action
        ],
        // [
        //   "spasm_title", title
        // ],
        // [
        //   "spasm_category", category
        // ],
      ],
      content: text,
      // pubkey: connectedAddress.value as string
      pubkey: nostrPublicKey
    }

    if (target) {
      nostrEvent.tags.push(["spasm_target", target])
    }

    if (title) {
      nostrEvent.tags.push(["spasm_title", title])
    }

    return nostrEvent
  }

  const submitSignature = async (signedString: string, signature: string, signerAddress: string): Promise<string | boolean | null | undefined> => {

    try {
      const {apiURL} = useRuntimeConfig()?.public

      const path = `${apiURL}/api/submit/`
      // console.log("path:", path)

      const data = {
        // dmpEvent: {
        unknownEvent: {
          signedString,
          signature,
          signer: signerAddress
        }
      }

      const res: string | boolean | null | undefined = await $fetch(path, {
        method: 'POST',
        body: data
      });

      return res

    } catch (err) {
      console.error(err)
      return false
    }
  }

  // Nostr
  const connectNostrExtension = async (): Promise<boolean> => {
    pendingAuthentication.value = true
    try {
      const nostrAccount: string = await getNostrPublicKey()

      if (nostrAccount && typeof (nostrAccount) === 'string') {
        setConnectedAddress(convertHexToBech32(nostrAccount, 'npub'), 'nostr')
        pendingAuthentication.value = false
        return true
      } else {
        pendingAuthentication.value = false
        return false
      }
    } catch (err) {
      console.error(err)
      pendingAuthentication.value = false
      return false
    }
  }

  const getNostrPublicKey = async (): Promise<string> => {
    try {
      const nostrPublicKey: string = await window.nostr.getPublicKey()
      return nostrPublicKey ? nostrPublicKey : ''
    } catch (error) {
      // User denied account access
      console.error(error)
      setConnectedAddress('','')
      return ''
    }
  }

  const submitNostrSignature = async (nostrEvent: NostrEvent): Promise<string | boolean | null | undefined> => {
    try {
      const {apiURL} = useRuntimeConfig()?.public

      const path = `${apiURL}/api/submit/`

      const data = { unknownEvent: nostrEvent }
      // const data = { nostrEvent }

      const res: string | boolean | null | undefined = await $fetch(path, {
        method: 'POST',
        body: data
      });

      return res

    } catch (err) {
      console.error(err)
      return false
    }
  }

  const convertHexToBech32 = (hexKey: string, prefix: string): string => {
    // Convert private or public key from HEX to bech32
    let bytes = new Uint8Array(hexKey.length / 2);

    for(let i = 0; i < hexKey.length; i+=2) {
        bytes[i/2] = parseInt(hexKey.substr(i, 2), 16);
    }

    const words = bech32.toWords(bytes);

    prefix = prefix ?? 'npub'

    const bech32Key = bech32.encode(prefix, words);

    return bech32Key
  }

  // Utils
  const sliceAddress = (
    address?: string | PostSignature,
    start: number = 6,
      end: number = 4
  ) => {
    return address
      ? `${address.slice(0, start)}...${address.slice(-end)}`
      : ''
  }

  const randomNumber = (min = 1, max = 1000000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const toBeShortId = (
    longId: string | number
  ): string => {
    const env = useRuntimeConfig()?.public
    const enableShortUrlsForWeb3Actions: boolean =
      env?.enableShortUrlsForWeb3Actions === 'false'? false : true
    const shortUrlsLengthOfWeb3Ids: number =
      env?.shortUrlsLengthOfWeb3Ids
        ? Number(env?.shortUrlsLengthOfWeb3Ids)
        : 20

    if (!longId) return ""
    const id: string = String(longId)
    if (!id || typeof(id) !== "string") return ""
    // Environment variables
    if (!enableShortUrlsForWeb3Actions) { return id }
    const shortId = id.slice(0,shortUrlsLengthOfWeb3Ids)
    if (!shortId) return ""
    return shortId
  }
  
  const extractIdForDisplay = (
    event: SpasmEventV2
  ): string => {
    const spasmEvent = spasm.toBeSpasmEventV2(event)
    if (!spasmEvent) return ""
    
    // Nostr ID has higher priority because the Nostr network
    // can only be queried with Nostr IDs, while Spasm instances
    // can be queried with both Nostr and Spasm IDs.
    const nostrId =
      spasm.extractIdByFormat(event, { name: "nostr-hex" })
    if (nostrId && typeof(nostrId) === "string") {
      return toBeNote(nostrId)
    }

    const spasmId = spasm.extractIdByFormat(event, {
      name: "spasmid", version: "01"
    })
    if (spasmId && typeof(spasmId) === "string") {
      return toBeShortId(spasmId)
    }

    return ""
  }

  const extractParentIdForDisplay = (
    event: SpasmEventV2
  ): string => {
    const spasmEvent = spasm.toBeSpasmEventV2(event)
    if (!spasmEvent) return ""

    // Nostr ID has higher priority because the Nostr network
    // can only be queried with Nostr IDs, while Spasm instances
    // can be queried with both Nostr and Spasm IDs.
    const nostrId =
      spasm.extractParentIdByFormat(event, { name: "nostr-hex" })
    if (nostrId && typeof(nostrId) === "string") {
      return toBeNote(nostrId)
    }

    const spasmId = spasm.extractParentIdByFormat(event, {
      name: "spasmid", version: "01"
    })
    if (spasmId && typeof(spasmId) === "string") {
      return toBeShortId(spasmId)
    }

    const dmpId = spasm.extractParentIdByFormat(event, {
      name: "ethereum-sig"
    })
    if (dmpId && typeof(dmpId) === "string") {
      return toBeShortId(dmpId)
    }


    return ""
  }
    

  return {
    isWeb3ModalShown: readonly(isWeb3ModalShown),
    isQrCodeModalShown: readonly(isQrCodeModalShown),
    qrCodeValue: readonly(qrCodeValue),
    pendingAuthentication: readonly(pendingAuthentication),
    isMultiSign: readonly(isMultiSign),
    connectedAddress: readonly(connectedAddress),
    connectedAddressEthereum: readonly(connectedAddressEthereum),
    connectedAddressNostr: readonly(connectedAddressNostr),
    connectedKeyType: readonly(connectedKeyType),
    signer: signer ? readonly(signer) : undefined,
    // assembledMessage: readonly(assembledMessage),
    spasmEventSignedWithEthereum:
      readonly(spasmEventSignedWithEthereum),
    spasmEventSignedWithNostr:
      readonly(spasmEventSignedWithNostr),
    savedMergedMultiSignedSpasmEventV2:
      readonly(savedMergedMultiSignedSpasmEventV2),
    isNetworkSpasmSelected,
    isNetworkNostrSelected,
    showWeb3Modal,
    hideWeb3Modal,
    showQrCodeModal,
    hideQrCodeModal,
    setQrCodeValue,
    turnOnMultiSign,
    turnOffMultiSign,
    connectWeb3Authenticator,
    detectProvider,
    setSigner,
    setRandomSigner,
    getSigner,
    listAccounts,
    setConnectedAddress,
    disconnectAccount,
    resetMultiSigning,
    removeAddressEthereum,
    removeAddressNostr,
    // submitEventV2,
    signMessageWithEthereum,
    signSavedMessageWithNostr,
    submitAction,
    connectNostrExtension,
    sliceAddress,
    randomNumber,
    // V2
    selectNetworkSpasm,
    deselectNetworkSpasm,
    selectNetworkNostr,
    deselectNetworkNostr,
    submitSingleSignedEventV2,
    submitMultiSignedEventV2,
    extractIdForDisplay,
    extractParentIdForDisplay
  }
}
