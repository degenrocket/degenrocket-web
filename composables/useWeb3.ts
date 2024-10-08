import {ref, readonly} from "vue";
import {ethers, JsonRpcApiProvider, JsonRpcSigner} from "ethers";
import {PostSignature, Web3Message, Web3MessageAction, NostrEvent} from "@/helpers/interfaces";
import { bech32 } from 'bech32'
import { validateEvent, verifySignature, getSignature, getEventHash } from 'nostr-tools'
// import detectEthereumProvider from '@metamask/detect-provider'
import DOMPurify from 'dompurify';

const isWeb3ModalShown = ref(false)
const isQrCodeModalShown = ref(false)
const pendingAuthentication = ref(false)
const qrCodeValue = ref<string | undefined>('')
let provider: JsonRpcApiProvider | undefined
let signer: JsonRpcSigner | undefined
const connectedAddress = ref<string | undefined>('')
const connectedKeyType = ref<string | undefined>('')

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
    // console.log("provider before:", provider)
    if (window?.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum)
      // console.log("provider after:", provider)
      return provider ? true : false
    }
    isWeb3ModalShown.value = true
    return false
  }

  // provider.getSigner() prompts a user to connect an account
  const setSigner = async (): Promise<void> => {
    // console.log("signer before:", signer)
    signer = await provider?.getSigner()
    // console.log("signer after:", signer)
  }

  const setRandomSigner = (): void => {
    // console.log("setSigner called")
    // console.log("signer before:", signer)
    signer = ethers.Wallet.createRandom()
    setConnectedAddress(signer?.address, 'ethereum')
    // console.log("signer after:", signer)
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
    // type can be 'ethereum', 'nostr', etc.
    keyType = keyType ?? 'ethereum'

    if (address && typeof (address) === 'string') {
      connectedAddress.value = address
      connectedKeyType.value = keyType
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
    signer = undefined
    provider = undefined
  }

  interface SubmitActionReturn {
    res: string | boolean | null | undefined,
    signature: string | undefined
  }

  // const stripHtml = (html?: string | number | boolean) => {
  //   if (!html || typeof(html) !== "string") return ""
  //   const doc = new DOMParser().parseFromString(html, 'text/html')
  //   return doc.body.textContent || ""
  // }

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

    // text = stripHtml(text)

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
      const signature: string | undefined = await signString(stringToSign)

      if (!signature) return false
      if (!signer?.address) return false
      const signerAddress = signer.address.toLowerCase()

      // verify the signature
      const isSignatureValid: boolean = verifyEthereumSignature(stringToSign, signature, signer?.address)
      // console.log("isSignatureValid:", isSignatureValid)

      if (!isSignatureValid) return false

      // send data to backed
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

  const signString = async (stringToSign: string): Promise<string | undefined> => {
    // TODO: delete signer, because use connectWeb3Authenticator
    if (!signer) { signer = await provider?.getSigner() }

    const message = stringToSign
    // console.log("message:", message)
    let signature: string | undefined

    try {
      signature = await signer?.signMessage(message)
      // console.log("signature:", signature)

      return signature

    } catch (err) {
      console.error('signString failed', err)
      return undefined
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
  const sliceAddress = (address?: string | PostSignature, start: number = 6, end: number = 4) => {
    return address ? `${address.slice(0, start)}...${address.slice(-end)}` : ''
  }

  const randomNumber = (min = 1, max = 1000000) => Math.floor(Math.random() * (max - min + 1)) + min

  return {
    isWeb3ModalShown: readonly(isWeb3ModalShown),
    isQrCodeModalShown: readonly(isQrCodeModalShown),
    qrCodeValue: readonly(qrCodeValue),
    pendingAuthentication: readonly(pendingAuthentication),
    connectedAddress: readonly(connectedAddress),
    connectedKeyType: readonly(connectedKeyType),
    signer: signer ? readonly(signer) : undefined,
    showWeb3Modal,
    hideWeb3Modal,
    showQrCodeModal,
    hideQrCodeModal,
    setQrCodeValue,
    connectWeb3Authenticator,
    detectProvider,
    setSigner,
    setRandomSigner,
    getSigner,
    listAccounts,
    setConnectedAddress,
    disconnectAccount,
    submitAction,
    connectNostrExtension,
    sliceAddress,
    randomNumber,
  }
}
