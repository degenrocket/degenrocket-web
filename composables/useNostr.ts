import {
  NostrEventSignedOpened,
  DataToExtractFromNostrEventKind0,
  DataToExtractFromNostrEventKind10002,
  DataToExtractFromNostrEvent,
  ProfileSpasm,
  // NostrEvent,
  NostrSpasmEventSignedOpened,
  // SpasmEventBodySignedClosedV2,
  SpasmEventV2
} from "./../helpers/interfaces";
import {bech32} from "bech32"
import {
  // validateEvent,
  verifySignature,
  // getSignature,
  // getEventHash
} from 'nostr-tools'
// import {RelayPool} from "nostr-relaypool";
import { SimplePool } from 'nostr-tools-v2/pool'
import {useUtils} from './useUtils';
import { spasm } from 'spasm.js'

const {
  hasValue,
  isArrayWithValues,
  isObjectWithValues,
} = useUtils()

export const useNostr = () => {
  const convertBech32ToHex = (bech32Key: string) => {
    if (!bech32Key || typeof(bech32Key) !== "string") return bech32Key

    if (
      !bech32Key.startsWith('npub') &&
      !bech32Key.startsWith('note') &&
      !bech32Key.startsWith('nevent')
    ) {
      console.error(bech32Key, "is invalid bech32 nostr string. It should start with 'npub' or 'note' or 'nevent'.");
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

    if (
      bech32Key.length === 68 &&
      bech32Key.startsWith("nevent") &&
      hexKey.length === 68
    ) {
      // Remove leading 0020
      hexKey = hexKey.slice(4)
    } 

    return hexKey;

    } catch (error) {
      console.error(error)
      return ''
    }
  }

  // Npub to hex.
  // One address.
  const convertNpubOrHexAddressToHex = (
    npubNoteNeventHex: string
  ): string => {
    if (!npubNoteNeventHex) return ""
    if (typeof(npubNoteNeventHex) !== "string") return ""
    // Ethereum addresses start with "0x"
    if (npubNoteNeventHex.startsWith("0x")) return ""

    let addressHex: string = ""

    if (
      // Address is npub
      npubNoteNeventHex.startsWith("npub") &&
      npubNoteNeventHex.length === 63
    ) {
      addressHex = convertBech32ToHex(npubNoteNeventHex)
    } else if (
      // String is note
      npubNoteNeventHex.startsWith("note") &&
      npubNoteNeventHex.length === 63
    ) {
      addressHex = convertBech32ToHex(npubNoteNeventHex)
    } else if (
      // String is note
      npubNoteNeventHex.startsWith("nevent") &&
      npubNoteNeventHex.length === 68
    ) {
      addressHex = convertBech32ToHex(npubNoteNeventHex)
    } else if (
      // Address is already hex
      !npubNoteNeventHex.startsWith("npub") &&
      npubNoteNeventHex.length === 64
    ) {
      addressHex = npubNoteNeventHex
    }

    return addressHex
  }

  // Npub to hex.
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

  // Hex to npub, note.
  const convertHexToBech32 = (
    hexKey: string,
    // nevent currently doesn't work properly
    prefix: "npub" | "note" | "nevent" = "npub"
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

  // Hex to npub.
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

  // Hex to npub.
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

  // Hex to note.
  // One address.
  const convertHexNoteNeventIdToNote = (
    id: string,
  ): string => {
    if (!id) return ""
    if (typeof(id) !== "string") return ""
    // Dmp ids start with "0x"
    if (id.startsWith("0x")) return ""
    // Spasm ids start with "spasm"
    if (id.startsWith("spasm")) return ""

    let idNote: string = ""

    if (
      // Id is hex
      !id.startsWith("note") &&
      !id.startsWith("nevent") &&
      id.length === 64
    ) {
      idNote = convertHexToBech32(id, "note")
    } else if (
      // Id is nevent
      id.startsWith("nevent") &&
      id.length === 68
    ) {
      idNote = convertHexToBech32(
        convertNpubOrHexAddressToHex(id),
        "note"
      )
    } else if (
      // Id is already note
      id.startsWith("note") &&
      id.length === 63
    ) {
      idNote = id
    }

    return idNote
  }

  // Hex, note, nevent to note
  // Multiple addresses.
  const convertHexNoteNeventIdsToNote = (
    idsHexNoteNevent: string | string []
  ): string[] => {
    const arrayOfIdsNote: string[] = []

    if (!hasValue(idsHexNoteNevent)) return arrayOfIdsNote

    // Passed value is one address (as a string)
    if (
      idsHexNoteNevent &&
      typeof(idsHexNoteNevent) === "string"
    ) {
      const idNote = convertHexNoteNeventIdToNote(idsHexNoteNevent)
      if (
        idNote &&
        typeof(idNote) === "string"
      ) {
        arrayOfIdsNote.push(idNote)
      }
      return arrayOfIdsNote
    }

    // Passed value is an array of addresses
    if (Array.isArray(idsHexNoteNevent)) {
      idsHexNoteNevent.forEach((
        addressNpubOrHex: string
      ): void => {
        if (
          addressNpubOrHex &&
          typeof(addressNpubOrHex) === "string"
        ) {
          const idNote = convertHexNoteNeventIdToNote(addressNpubOrHex)
          if (
            idNote &&
            typeof(idNote) === "string"
          ) {
            arrayOfIdsNote.push(idNote)
          }
        }
      })
      return arrayOfIdsNote
    }

    return arrayOfIdsNote
  }

  // Aliases
  const convertHexOrNpubAddressesToNpub =
    convertHexAddressesToNpub

  const toBeHex = convertNpubOrHexAddressToHex
  const toBeHexes = convertNpubOrHexAddressesToHex

  const toBeNpub = convertHexOrNpubAddressToNpub
  const toBeNpubs = convertHexOrNpubAddressesToNpub

  const toBeNote = convertHexNoteNeventIdToNote
  const toBeNotes = convertHexNoteNeventIdsToNote

  const isHex = (
    value: string
  ): boolean => {
    if (!value) return false
    if (typeof(value) !== "string") return false
    const hexChars = [
      "0","1","2","3","4","5","6","7","8","9",
      "a","b","c","d","e","f"
    ]
    const valueArray = value.toLowerCase().split("")
    return valueArray.every(char => hexChars.includes(char))
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

  const getHardcodedNostrRelays = (): string[] => {
    return [
      "wss://nos.lol",
      "wss://relay.damus.io",
      "wss://relay.primal.net",
      "wss://relay.nostr.band",

      // can fetch, but cannot submit:
      // "wss://relay.snort.social",
      // "wss://relay.nostrplebs.com",
      // "wss://eden.nostr.land",
      // "wss://nostr.wine",
      // "wss://relay.plebstr.com",
      // "wss://purplepag.es",
    ]
  }

  const getDefaultNostrRelays = (): string[] => {
    const defaultNostrRelays: string[] = []
    const envRelaysString = 
      useRuntimeConfig()?.public?.nostrDefaultRelays
    if (
      envRelaysString && typeof(envRelaysString) === "string"
    ) {
      const envRelaysArray = envRelaysString.split(',')
      if (
        envRelaysArray && isArrayWithValues(envRelaysArray)
      ) {
        envRelaysArray.forEach(relayUrl => {
          if (
            relayUrl && typeof(relayUrl) === "string" &&
            relayUrl.startsWith("wss:\/\/")
          ) {
            defaultNostrRelays.push(relayUrl)
          }
        })
      }
    }
    return defaultNostrRelays
  }

  const getNostrRelays = (
    profile?: ProfileSpasm
  ): string[] | null => {
    // There are three methods to get different sets of relays:
    // 1. Get user's preferred relays from a special Nostr event,
    // 2. Get default relays specified by the instance admin,
    // 3. Get hardcoded relays.

    if (profile && isObjectWithValues(profile)) {
      const preferredRelays: string[] =
        getPreferredRelaysFromProfile(profile)
        if (
          preferredRelays &&
          isArrayWithValues(preferredRelays)
        ) { return preferredRelays }
    }
    
    const defaultRelays = getDefaultNostrRelays()
    if (
      isArrayWithValues(defaultRelays)
    ) { return defaultRelays }

    const hardcodedRelays = getHardcodedNostrRelays()
    if (
      isArrayWithValues(hardcodedRelays)
    ) { return hardcodedRelays }

    return null
  }

  const sendEventToNostrNetwork = async (
    spasmEvent: SpasmEventV2
  ): Promise<boolean> => {
    if (!spasmEvent) return false
    const nostrEventSigned:
      NostrSpasmEventSignedOpened |
      NostrSpasmEventSignedOpened
      = spasm.extractSignedNostrEvent(spasmEvent)
    if (!nostrEventSigned) return false
    if (!isObjectWithValues(nostrEventSigned)) return false

    // verify the signature
    const isSignatureValid: boolean =
      verifySignature(nostrEventSigned)
    if (!isSignatureValid) return false
    console.log("isSignatureValid:", isSignatureValid)
    console.log("nostrEventSigned:", nostrEventSigned)

    const relays = getNostrRelays()
    // const relays = [
      // "wss://nos.lol",
      // "wss://relay.damus.io",
      // "wss://relay.primal.net",
      // "wss://relay.nostr.band",

      // can fetch, but cannot submit:
      // "wss://relay.snort.social",
      // "wss://relay.nostrplebs.com",
      // "wss://eden.nostr.land",
      // "wss://nostr.wine",
      // "wss://relay.plebstr.com",
      // "wss://purplepag.es",
    // ]
    if (!relays) return false
    console.log("Submitting event to nostr relays:", relays)

    const relayPool = new SimplePool()

    await Promise.any(relayPool.publish(relays, nostrEventSigned))
    console.log("event published")

    // let relayPool = new RelayPool(relays);
    // let relayPool = new RelayPool();
    // relayPool.publish(nostrEventSigned, relays)

    // TODO receive event or confirmation from Nostr relays
    return true
  }

  interface NostrNetworkFiltersConfig {
    ids?: string[]
    authors?: string[]
    kinds?: number[]
    since?: number
    until?: number
    limit?: number
    tags?: { tagName: string, tagValue: string[] }[]
  }

  type NostrNetworkFilters = {
    ids?: string[]
    authors?: string[]
    kinds?: number[]
    since?: number
    until?: number
    limit?: number
    // tags
  } & Record<string, string[]>

  const assembleNostrNetworkFilters = (
    filtersConfig: NostrNetworkFiltersConfig
  ): NostrNetworkFilters | null => {
    if (
      !filtersConfig || !isObjectWithValues(filtersConfig)
    ) return null
    const filters: NostrNetworkFilters = {}
    if (
      "ids" in filtersConfig && filtersConfig.ids &&
      isArrayWithValues(filtersConfig.ids)
    ) { filters.ids = filtersConfig.ids }
    if (
      "authors" in filtersConfig && filtersConfig.authors &&
      isArrayWithValues(filtersConfig.authors)
    ) { filters.authors = filtersConfig.authors }
    if (
      "kinds" in filtersConfig && filtersConfig.kinds &&
      isArrayWithValues(filtersConfig.kinds)
    ) { filters.kinds = filtersConfig.kinds }
    if (
      "since" in filtersConfig && filtersConfig.since &&
      typeof(filtersConfig.since) === "number"
    ) { filters.since = filtersConfig.since }
    if (
      "until" in filtersConfig && filtersConfig.until &&
      typeof(filtersConfig.until) === "number"
    ) { filters.until = filtersConfig.until }
    if (
      "limit" in filtersConfig && filtersConfig.limit &&
      typeof(filtersConfig.limit) === "number"
    ) {
      filters.limit = filtersConfig.limit
    } else {
      filters.limit = 30
    }
    if (
      "tags" in filtersConfig && filtersConfig.tags &&
      isArrayWithValues(filtersConfig.tags)
    ) {
      filtersConfig.tags.forEach(tag => {
        if (
          "tagName" in tag && tag.tagName
          && typeof(tag.tagName) === "string" &&
          "tagValue" in tag && tag.tagValue
          && typeof(tag.tagValue) === "string"
        ) { filters[tag.tagName] = tag.tagValue }
      })
    }
    if (isObjectWithValues(filters)) {
      return filters
    } else { return null }
  }

  return {
    convertBech32ToHex,
    convertNpubOrHexAddressToHex,
    convertNpubOrHexAddressesToHex,
    convertHexToBech32,
    convertHexOrNpubAddressToNpub,
    convertHexAddressesToNpub,
    convertHexOrNpubAddressesToNpub,
    toBeHex,
    toBeHexes,
    toBeNpub,
    toBeNpubs,
    toBeNote,
    toBeNotes,
    isHex,
    extractDataFromNostrEvent,
    getPreferredRelaysFromProfile,
    getHardcodedNostrRelays,
    getDefaultNostrRelays,
    assembleNostrNetworkFilters,
    getNostrRelays,
    sendEventToNostrNetwork,
  }
}
