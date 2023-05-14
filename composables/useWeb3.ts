import {ref, readonly} from "vue";
import {ethers, JsonRpcApiProvider, JsonRpcSigner} from "ethers";
import {PostSignature, Web3Message, Web3MessageAction} from "@/helpers/interfaces";
// import detectEthereumProvider from '@metamask/detect-provider'

const isWeb3ModalShown = ref(false)
const pendingAuthentication = ref(false)
let provider: JsonRpcApiProvider | undefined
let signer: JsonRpcSigner | undefined
const connectedAddress = ref<string | undefined>('')

export const useWeb3 = () => {
  const showWeb3Modal = (): void => {
    isWeb3ModalShown.value = true
    // console.log("isWeb3ModalShown:", isWeb3ModalShown.value)
  }

  const hideWeb3Modal = (): void => {
    isWeb3ModalShown.value = false
    // console.log("isWeb3ModalShown:", isWeb3ModalShown.value)
  }

  const connectWeb3Authenticator = async (): Promise<boolean> => {
    pendingAuthentication.value = true
    try {
      await detectProvider()
      await setSigner()
      const accounts: JsonRpcSigner[] | undefined = await listAccounts()

      if (Array.isArray(accounts) &&
        typeof (accounts?.[0]?.address) === 'string') {
        setConnectedAddress(accounts?.[0]?.address)
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
    // console.log("detectProvider called")
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
    // console.log("setSigner called")
    // console.log("signer before:", signer)
    signer = await provider?.getSigner()
    // console.log("signer after:", signer)
  }

  const setRandomSigner = (): void => {
    // console.log("setSigner called")
    // console.log("signer before:", signer)
    signer = ethers.Wallet.createRandom()
    setConnectedAddress(signer?.address)
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
      setConnectedAddress(accounts?.[0]?.address)
      return accounts ? accounts : []
    } catch (error) {
      // User denied account access
      console.error(error)
      setConnectedAddress('')
      return []
    }
  }

  const setConnectedAddress = (address?: string): boolean => {
    if (address && typeof (address) === 'string') {
      connectedAddress.value = address
      return true
    } else {
      connectedAddress.value = ""
      return false
    }
  }

  const disconnectAccount = (): void => {
    connectedAddress.value = ""
    signer = undefined
    provider = undefined
  }

  interface SubmitActionReturn {
    res: string | boolean | null | undefined,
    signature: string | undefined
  }

  const submitAction = async (action?: Web3MessageAction, text?: string, target?: string, title?: string): Promise<SubmitActionReturn | false> => {
    if (!signer) { await connectWeb3Authenticator() }
    // console.log("submitAction called")

    try {
      // assemble JSON object for signing
      const web3MessageJson: Web3Message = assembleActionIntoJSON(action, target, text, title)
      // console.log("web3Message:", web3MessageJson)

      const stringToSign: string = JSON.stringify(web3MessageJson)
      // console.log("stringToSign:", stringToSign)

      // sign the message
      const signature: string | undefined = await signString(stringToSign)

      if (!signature) return false
      if (!signer?.address) return false
      const signerAddress = signer.address.toLowerCase()

      // verify the signature
      const isSignatureValid: boolean = verifySignature(stringToSign, signature, signer?.address)
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

  const verifySignature = (messageString: string, signature: string, signerAddress: string): boolean => {

    if (signature && typeof (signature) === 'string') {
      const recoveredAddress = ethers.verifyMessage(messageString, signature)
      // console.log("recoveredAddress:", recoveredAddress)
      // console.log("signerAddress:", signerAddress)
      // console.log(recoveredAddress === signerAddress)

      return recoveredAddress.toLowerCase() === signerAddress.toLowerCase()
    }

    return false
  }

  const assembleActionIntoJSON = (action?: Web3MessageAction, target?: string, text?: string, title?: string): Web3Message => {
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
      license: 'MIT'
    }
  }

  const submitSignature = async (signedString: string, signature: string, signerAddress: string): Promise<string | boolean | null | undefined> => {

    try {
      const {apiURL} = useRuntimeConfig()?.public

      const path = `${apiURL}/api/submit/`
      // console.log("path:", path)

      const data = {signedString, signature, signer: signerAddress}
      // console.log('data in submitSignature is:', data)

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

  // Utils
  const sliceAddress = (address?: string | PostSignature, start: number = 6, end: number = 4) => {
    return address ? `${address.slice(0, start)}...${address.slice(-end)}` : ''
  }

  const randomNumber = (min = 1, max = 1000000) => Math.floor(Math.random() * (max - min + 1)) + min

  return {
    isWeb3ModalShown: readonly(isWeb3ModalShown),
    pendingAuthentication: readonly(pendingAuthentication),
    connectedAddress: readonly(connectedAddress),
    signer: signer ? readonly(signer) : undefined,
    showWeb3Modal,
    hideWeb3Modal,
    connectWeb3Authenticator,
    detectProvider,
    setSigner,
    setRandomSigner,
    getSigner,
    listAccounts,
    setConnectedAddress,
    disconnectAccount,
    submitAction,
    sliceAddress,
    randomNumber,
  }
}
