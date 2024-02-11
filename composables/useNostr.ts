import {
  NostrEventSignedOpened,
  DataToExtractFromNostrEventKind0,
  DataToExtractFromNostrEventKind10002,
  DataToExtractFromNostrEvent,
  ProfileSpasm
} from "@/helpers/interfaces";
import {bech32} from "bech32"
import {useUtils} from './useUtils';
const {hasValue} = useUtils()

export const useNostr = () => {
  // Npub to hex with 3 functions.
  // Npub to hex. Function 1.
  const convertBech32ToHex = (bech32Key: string) => {
    if (!bech32Key || typeof(bech32Key) !== "string") return bech32Key

    if (!bech32Key.startsWith('npub')) {
      console.error(bech32Key, "is invalid bech32 string. It should start with 'npub'.");
      return bech32Key
    }

    try {
    // Decode the bech32 string to get the words array
    const decoded = bech32.decode(bech32Key);

    // Convert the words array to bytes
    const bytes = bech32.fromWords(decoded.words);

    // Convert the bytes to a hex string
    let hexKey = '';

    if (!bytes || !Array.isArray(bytes)) return ''

    for(let byte of bytes) {
      hexKey += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }

      return hexKey;

    } catch (error) {
      console.error(error)
      return ''
    }
  }

  // Npub to hex. Function 2.
  // One address.
  const convertNpubOrHexAddressToHex = (
    addressNpubOrHex: string
  ): string => {
    if (!addressNpubOrHex) return ""
    if (typeof(addressNpubOrHex) !== "string") return ""
    // Ethereum addresses start with "0x"
    if (addressNpubOrHex.startsWith("0x")) return ""

    let addressHex: string = ""

    if (
      // Address is npub
      addressNpubOrHex.startsWith("npub") &&
      addressNpubOrHex.length === 63
    ) {
      addressHex = convertBech32ToHex(addressNpubOrHex)
    } else if (
      // Address is already hex
      !addressNpubOrHex.startsWith("npub") &&
      addressNpubOrHex.length === 64
    ) {
      addressHex = addressNpubOrHex
    }

    return addressHex
  }

  // Npub to hex. Function 3.
  // Multiple addresses.
  const convertNpubOrHexAddressesToHex = (
    addressesNpubOrHex: string | string[]
  ): string[] => {
    const arrayOfAddressesHex: string[] = []

    if (!hasValue(addressesNpubOrHex)) return arrayOfAddressesHex

    // Passed value is one address (as a string)
    if (
      addressesNpubOrHex &&
      typeof(addressesNpubOrHex) === "string"
    ) {
      const addressHex = convertNpubOrHexAddressToHex(addressesNpubOrHex)

      if (
        addressHex &&
        typeof(addressHex) === "string"
      ) {
        arrayOfAddressesHex.push(addressHex)
      }
      return arrayOfAddressesHex
    }

    // Passed value is an array of addresses
    if (Array.isArray(addressesNpubOrHex)) {
      addressesNpubOrHex.forEach((
        addressNpubOrHex: string
      ): void => {
        if (
          addressNpubOrHex &&
          typeof(addressNpubOrHex) === "string"
        ) {
          const addressHex = convertNpubOrHexAddressToHex(addressNpubOrHex)

          if (
            addressHex &&
            typeof(addressHex) === "string"
          ) {
            arrayOfAddressesHex.push(addressHex)
          }
        }
      })
      return arrayOfAddressesHex
    }

    return arrayOfAddressesHex
  }

  // Hex to npub with 3 functions.
  // Hex to npub. Function 1.
  const convertHexToBech32 = (
    hexKey: string,
    prefix?: string
  ): string => {
    try {
      // Convert private or public key from HEX to bech32
      let bytes = new Uint8Array(hexKey.length / 2);

      for(let i = 0; i < hexKey.length; i+=2) {
          bytes[i/2] = parseInt(hexKey.substr(i, 2), 16);
      }

      const words = bech32.toWords(bytes);

      prefix = prefix ?? 'npub'

      const bech32Key = bech32.encode(prefix, words);

      return bech32Key
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  // Hex to npub. Function 2.
  // One address.
  const convertHexOrNpubAddressToNpub = (
    addressNpubOrHex: string
  ): string => {
    if (!addressNpubOrHex) return ""
    if (typeof(addressNpubOrHex) !== "string") return ""
    // Ethereum addresses start with "0x"
    if (addressNpubOrHex.startsWith("0x")) return ""

    let addressNpub: string = ""
    
    if (
      // Address is hex
      !addressNpubOrHex.startsWith("npub") &&
      addressNpubOrHex.length === 64
    ) {
      addressNpub = convertHexToBech32(addressNpubOrHex)
    } else if (
      // Address is already npub
      addressNpubOrHex.startsWith("npub") &&
      addressNpubOrHex.length === 63
    ) {
      addressNpub = addressNpubOrHex
    }

    return addressNpub
  }

  // Hex to npub. Function 3.
  // Multiple addresses.
  const convertHexAddressesToNpub = (
    addressesNpubOrHex: string | string []
  ): string[] => {
    const arrayOfAddressesNpub: string[] = []

    if (!hasValue(addressesNpubOrHex)) return arrayOfAddressesNpub

    // Passed value is one address (as a string)
    if (
      addressesNpubOrHex &&
      typeof(addressesNpubOrHex) === "string"
    ) {
      const addressNpub = convertHexOrNpubAddressToNpub(addressesNpubOrHex)
      if (
        addressNpub &&
        typeof(addressNpub) === "string"
      ) {
        arrayOfAddressesNpub.push(addressNpub)
      }
      return arrayOfAddressesNpub
    }

    // Passed value is an array of addresses
    if (Array.isArray(addressesNpubOrHex)) {
      addressesNpubOrHex.forEach((
        addressNpubOrHex: string
      ): void => {
        if (
          addressNpubOrHex &&
          typeof(addressNpubOrHex) === "string"
        ) {
          const addressNpub = convertHexOrNpubAddressToNpub(addressNpubOrHex)
          if (
            addressNpub &&
            typeof(addressNpub) === "string"
          ) {
            arrayOfAddressesNpub.push(addressNpub)
          }
        }
      })
      return arrayOfAddressesNpub
    }

    return arrayOfAddressesNpub
  }

  const extractDataFromNostrEvent = (
    event: NostrEventSignedOpened,
    dataToExtract: DataToExtractFromNostrEvent
  ): string | string[] => {

    let defaultReturn: string | [] = ""

    if (
      dataToExtract === "username" ||
      dataToExtract === "about" ||
      dataToExtract === "website" ||
      dataToExtract === "picture"
    ) {
      defaultReturn = ""
    } else if (
      dataToExtract === "relays" ||
      dataToExtract === "preferredRelays" ||
      dataToExtract === "preferred-relays"
    ) {
      defaultReturn = []
    }

    if (
      !event ||
      typeof(event) !== "object" ||
      !hasValue(event)
    ) { return defaultReturn }

    // Username, about, website (kind 0 event)
    if (
      dataToExtract === "username" ||
      dataToExtract === "about" ||
      dataToExtract === "website" ||
      dataToExtract === "picture"
    ) {
      // kind 0
      return extractDataFromNostrEventKind0(event, dataToExtract)
    }

    // Preferred relays (kind 10002 event)
    if (
      dataToExtract === "relays" ||
      dataToExtract === "preferredRelays" ||
      dataToExtract === "preferred-relays"
    ) {
      // kind 10002
      return extractDataFromNostrEventKind10002(event, dataToExtract)
    }

    return defaultReturn
  }

  const extractDataFromNostrEventKind0 = (
    event: NostrEventSignedOpened,
    dataToExtract: DataToExtractFromNostrEventKind0
  ): string => {
    if (
      !event ||
      typeof(event) !== "object" ||
      !hasValue(event) ||
      !('kind' in event) ||
      event.kind !== 0 &&
      !('content' in event) ||
      typeof(event.content) !== "string"
    ) { return "" }

    const extractValueFrom = (
      property: string,
      object: Record<string, any>
    ): string => {
      if (
        typeof(object) === "object" &&
        property in object &&
        object[property] &&
        typeof(object[property]) === "string"
      ) { return object[property] }
      return ""
    }

    /**
      The 'content' of 'kind 0' event is usually a stringified
      object, which can be parsed with JSON.parse().
      However, it's better to use a 'try-catch' block in case if
      the content is not a stringified object, but a text note.
    */

    try {
      const contentObj = JSON.parse(event.content)

      if (
        contentObj &&
        typeof(contentObj) === "object"
      ) {

        let data: string = ""

        if (dataToExtract === "username") {
          data = extractValueFrom('username', contentObj) ||
                 extractValueFrom('name', contentObj) ||
                 extractValueFrom('displayName', contentObj) ||
                 extractValueFrom('display_name', contentObj)

        } else if (dataToExtract === "about") {
          data = extractValueFrom('about', contentObj)

        } else if (dataToExtract === "website") {
          data = extractValueFrom('website', contentObj)

        } else if (dataToExtract === "picture") {
          const mayBeUrl = extractValueFrom(
            'picture', contentObj
          )
          if (
            mayBeUrl &&
            typeof(mayBeUrl) === "string" && 
            mayBeUrl?.startsWith("https://")
          ) {
            data = mayBeUrl
          }
        }

        return data || ""
      }
    } catch (error) {
      // console.log('Could not parse content as JSON');
      return ""
    }

    return ""
  }

  const extractDataFromNostrEventKind10002 = (
    event: NostrEventSignedOpened,
    dataToExtract: DataToExtractFromNostrEventKind10002
  ): string[] => {
    if (
      !event ||
      typeof(event) !== "object" ||
      !hasValue(event) ||
      !('kind' in event) ||
      event.kind !== 10002 &&
      !('tags' in event) ||
      !Array.isArray(event.tags)
    ) { return [] }

    if (
      dataToExtract !== "relays" &&
      dataToExtract !== "preferredRelays" &&
      dataToExtract !== "preferred-relays"
    ) {
      return []
    }

    let listOfRelays: string [] = []

    event.tags.forEach((tag) => {
      if (
        tag?.[0] &&
        tag[0] === "r" &&
        tag[1] &&
        typeof(tag[1]) === "string" &&
        tag[1].startsWith("wss://") &&
        // Check duplicate
        !listOfRelays.includes(tag[1])
      ) {
        listOfRelays.push(tag[1])
      }
    })

    return listOfRelays
  }

  const getPreferredRelaysFromProfile = (
    profile: ProfileSpasm
  ): string[] => {
    const eventsOfKind10002 = profile
                              ?.nostr?.events?.kind?.[10002]

    const eventWithPreferredRelays = eventsOfKind10002?.[0]

    let preferredRelays: string[] = []

    if (
      eventWithPreferredRelays &&
      typeof(eventWithPreferredRelays) === "object"
    ) {
      const extractedData = extractDataFromNostrEvent(
        eventWithPreferredRelays,
        "preferredRelays"
      )

      if (
        hasValue(extractedData) &&
        Array.isArray(extractedData)
      ) {
        preferredRelays = extractedData
      }
    }
    return preferredRelays
  }

  return {
    convertBech32ToHex,
    convertNpubOrHexAddressToHex,
    convertNpubOrHexAddressesToHex,
    convertHexToBech32,
    convertHexOrNpubAddressToNpub,
    convertHexAddressesToNpub,
    extractDataFromNostrEvent,
    getPreferredRelaysFromProfile,
  }
}
