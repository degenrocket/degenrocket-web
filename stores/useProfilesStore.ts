/**
 * The logic of communication with Nostr relays:
 * - add addresses that have to be checked to the list,
 * - trigger the udpate function,
 * - check against default relays,
 * - check against preferred relays,
 * - empty the list of addresses that have to be checked.
 *
 * Step 1.
 * 
 * Add all addresses to the list of addresses that should
 * be checked for profiles (e.g., Nostr profiles, ENS, etc.)
 * 
 * Addresses are added when:
 * - they are rendered in the UI on the client-side,
 * - they are added to a pinia store (usePostsStore).
 *
 * Profiles in the Nostr network are set with events of kind 0,
 * preferred relays are specified with events of kind 10002,
 * and public messages (simple notes) are events of kind 1.
 *
 * Thus, all Nostr-looking addresses (e.g., those that start
 * with 'npub') are placed in different update lists.
 *
 * For example, if we get an address from the feed or the
 * comments section, we most likely only need a username
 * and preferred relays of that address, not all messages.
 * So we gonna add that address to only two lists.
 * - Username:
 *   this.addresses.toBeCheckedFor.nostr.kind[0]
 * - Preferred relays:
 *   this.addresses.toBeCheckedFor.nostr.kind[10002]
 *
 * If we get an address from the authors page, then we
 * most likely want to receive a username (also other
 * metadata like 'about', 'website', may be 'picture'),
 * preferred relays, and the latest public messages (kind 1).
 * So we gonna add that address to at least three lists.
 * - Username:
 *   this.addresses.toBeCheckedFor.nostr.kind[0]
 * - Preferred relays:
 *   this.addresses.toBeCheckedFor.nostr.kind[10002]
 * - Public messages:
 *   this.addresses.toBeCheckedFor.nostr.kind[1]
 *
 * To avoid creating many unnecessary requests to Nostr relays
 * for the data that we already have, we only add an address
 * to the update list if we don't have any events of that kind
 * associated with this address in the store yet.
 * For example, we store the metadata (username, about) in:
 *   this.profiles[index].nostr.events.kind[0]
 *
 * However, if forceUpdate is specified, we add an address to
 * the list anyway, making sure that we will fetch the latest
 * events when the updateAllProfiles() function is triggered.
 *
 * Use cases:
 * - We can call addAddress() from the feed or comments section
 *   with the 'forceUpdate' flag set to false, because we
 *   don't need to show latest up-to-date usernames.
 * - We can call addAddress() from the authors page with the
 *   'forceUpdate' flag set to true, because we probably want
 *   to display all the latest public messages even if we
 *   already fetched public messages for this address a few
 *   minutes ago.
 *
 * Step 2.
 *
 * Once all addresses are rendered on the UI or added to the
 * usePostsStore pinia store, we call the updateAllProfiles()
 * function.
 *
 * The update function distinguishes Ethereum addresses and
 * Nostr addresses and starts the update process.
 *
 * Ethereum update.
 * The Ethereum update (ENS, Unstoppable Domains) has not been
 * implemented yet.
 *
 * Nostr update.
 * The function takes the list of custom default profiles from
 * the .env file or the list of hardcoded default profiles in
 * this file. The function then checks all addresses for all
 * kinds for all default relays.
 *
 * However, all default relays are checked separately for
 * each event kind separately.
 * 
 * For example, if we need to check 2 default relays for
 * 3 kinds of events (0, 10002, and 1), then we gonna establish
 * 6 websocket connections in total. 3 connections for one
 * relay and 3 connections for another relay.
 *
 * Why not just check one relay for all event kinds and
 * addresses within one connection?
 *
 * TODO: old documentation, need to adjust to nostr-tools-v2.
 * Because that won't allow us to confidently determine which
 * relays have which event kinds for which addresses due to
 * limitations of the 'nostr-relays' npm package.
 *
 * For example, a relay might have an event of kind 0, but not
 * have any events of kind 10002 for a particular address. If
 * we request both event kinds within one websocket connection,
 * we can't properly mark this relay as having events of kind 0
 * and not having events of kind 10002.
 *
 * --------
 * TODO: actually, we can. Try to remember if there was another
 * major reason for checking each kind separately and add that
 * to documentation. Otherwise, do some refactoring by making
 * a more complex function that properly marks relays at the
 * end of each websocket connection. However, it's not clear
 * how to determine when the connection has ended, because
 * events can arrive even after EOSE (end of subscription
 * events). Thus, we will probably need to add to each event
 * the relay URL from which this event came from and then 
 * mark all the relays after the update function.
 * --------
 *
 * Thus, we currently request different kinds separately.
 *
 * OK, but why do we need to mark each relay as having or not
 * having events of a particular kind for a particular event?
 * We can just request the data for all addresses for all kinds
 * from all relays every time when the update function is
 * triggered, can't we?
 *
 * We absolutely can do that, but that will create a lot of
 * unnecessary connections to Nostr relays, which is bad for
 * the bandwidth of users and Nostr relays. The feed or the
 * comments section can have 20+ different Nostr addresses
 * with different preferred relays, so checking all these
 * addresses against all the relays every time an update is
 * triggered would be a disaster.
 *
 * Instead, we mark each checked relay for each address as
 * having or not having the events of different kinds, so
 * when the update function is triggered, we can skip relays
 * that don't have any events for this kind for this address.
 *
 * We store the list of relays that have events of kind 0
 * (username, about, picture) for a particular profile at:
 *   profile.nostr.relays.checkedRelays.hasEventsOfKind[0]
 *
 * For example, we need to update public messages (kind 1)
 * events for an address, but we already know that 7 out of 8
 * default relays don't have any events of kind 1 for this
 * address, so we can skip them and only request events from
 * one relay that has such events.
 *
 * Another example is temporary Nostr addresses that don't even
 * have any username set via an event of kind 0, so after
 * checking them against default relays once, we can skip them
 * after the next update function is triggered.
 *
 * Step 3.
 *
 * After all default relays are checked and properly marked,
 * we check each address one by one whether it has preferred
 * relays specified in the event of kind 10002.
 *
 * If preferred relays are found, we request the desired data
 * from the preferred relays.
 *
 * Step 4.
 *
 * After checking default and preferred relays, we empty the
 * list of addressed that have to be checked for the events.
 *
 */

import {defineStore} from 'pinia'
import { validateEvent, verifySignature } from 'nostr-tools'
import {
  Post,
  NostrEventSignedOpened,
  DataToExtractFromNostrEventKind0,
  ProfileSpasm,
  NostrEventKind,
  SpasmEventV2,
  NostrNetworkFilter,
CustomSubscribeToNostrRelayConfig
} from '@/helpers/interfaces'
import { spasm } from 'spasm.js'
import {useNostrRelaysStore} from './useNostrRelaysStore';

const {
  hasValue,
  isArrayOfStrings,
  isArrayOfStringsWithValues,
  isArrayWithValues,
  isObjectWithValues,
  removeDuplicatesFromArray,
  removeNonStringValuesFromArray,
  // emptyAllNestedArraysInsideObject,
  deleteMatchingValuesFromObject,
  pushToArrayIfValueIsUnique,
  deepCopyOfObject,
  sanitizeObjectValuesWithDompurify
} = useUtils()

const {
  convertNpubOrHexAddressesToHex,
  convertHexOrNpubAddressToNpub,
  extractDataFromNostrEvent,
  getPreferredRelaysFromProfile
} = useNostr()

interface Addresses {
  foundNothing: string[],
  foundSomething: string[],
  toBeCheckedFor: Queue
}

// List of addresses to be checked for:
interface Queue {
  ethereum: QueueEthereum,
  nostr: QueueNostr,
}

interface QueueEthereum {
  ens: string[],
}

interface QueueNostr {
  relays: QueueNostrRelays,
  kind: QueueNostrKinds
}

interface QueueNostrRelays {
    default: string[],
    defaultExtended: string[],
}

interface QueueNostrKinds {
  any: string[],
  0: string[],
  10002: string[],
  1: string[],
}

export interface ProfilesState {
  enableNostrNetwork: any
  enableNostrNetworkFetchProfiles: any
  enableNostrNetworkFetchPreferredRelays: any
  enableNostrNetworkUsePreferredRelays: any
  enableNostrNetworkFetchMessages: any
  enableNostrDisplayProfilesUsernames: any
  enableNostrDisplayProfilesAbouts: any
  enableNostrDisplayProfilesWebsites: any
  enableNostrDisplayProfilesPictures: any
  enableNostrDisplayProfilesMessages: any
  isUpdatingProfiles: boolean
  isUpdatingProfilesNostr: boolean
  profiles: ProfileSpasm[]
  addresses: Addresses
}

type UpdateType = "username" | "relays" | "messages"

type Protocol = "nostr" | "ethereum"

export const useProfilesStore = defineStore('profilesStore', {

state: (): ProfilesState => ({
  // Environment settings:
  // Nostr network
  enableNostrNetwork: useRuntimeConfig()?.public
    ?.enableNostrNetwork === "true" ? true : false,
  // Fetch data from Nostr relays:
  enableNostrNetworkFetchProfiles: useRuntimeConfig()?.public
    ?.enableNostrNetworkFetchProfiles === "true" ? true : false,
  enableNostrNetworkFetchPreferredRelays: useRuntimeConfig()?.public
    ?.enableNostrNetworkFetchPreferredRelays === "true" ? true : false,
  enableNostrNetworkFetchMessages: useRuntimeConfig()?.public
    ?.enableNostrNetworkFetchMessages === "true" ? true : false,
  // Use Nostr network:
  enableNostrNetworkUsePreferredRelays: useRuntimeConfig()?.public
    ?.enableNostrNetworkUsePreferredRelays === "true" ? true : false,
  // Display data from Nostr relays:
  enableNostrDisplayProfilesUsernames: useRuntimeConfig()?.public
    ?.enableNostrDisplayProfilesUsernames === "true" ? true : false,
  enableNostrDisplayProfilesAbouts: useRuntimeConfig()?.public
    ?.enableNostrDisplayProfilesAbouts === "true" ? true : false,
  enableNostrDisplayProfilesWebsites: useRuntimeConfig()?.public
    ?.enableNostrDisplayProfilesWebsites === "true" ? true : false,
  enableNostrDisplayProfilesPictures: useRuntimeConfig()?.public
    ?.enableNostrDisplayProfilesPictures === "true" ? true : false,
  enableNostrDisplayProfilesMessages: useRuntimeConfig()?.public
    ?.enableNostrDisplayProfilesMessages === "true" ? true : false,
  // Actual state:
  isUpdatingProfiles: false,
  isUpdatingProfilesNostr: false,
  addresses: {
    foundNothing: [],
    foundSomething: [],
    toBeCheckedFor: {
      ethereum: {
        ens: []
      },
      nostr: {
        relays: {
          default: (
            // Convert a string specified in .env into an array
            // of default relays that start with wss://
            typeof(useRuntimeConfig()?.public?.nostrDefaultRelays) === "string"
            ? (
              useRuntimeConfig()?.public?.nostrDefaultRelays.split(',')
                .filter(relayUrl => relayUrl.startsWith("wss:\/\/"))[0]
              // Use custom default relays from .env file only
              // if at least one valid relay was found,
              ? useRuntimeConfig()?.public?.nostrDefaultRelays.split(',')
                .filter(relayUrl => relayUrl.startsWith("wss:\/\/"))
              // otherwise use hardcoded default relays.
              : false
            )
            : false
          // If valid default relays are not specified in .env,
          // then set the following relays as default:
          ) || [
            "wss://nos.lol",
            "wss://relay.damus.io",
            "wss://relay.primal.net",
            "wss://relay.nostr.band",
            // "wss://relay.snort.social",
            // "wss://relay.nostrplebs.com",
            // "wss://eden.nostr.land",
            // "wss://nostr.wine",
            // "wss://relay.plebstr.com",
            // "wss://purplepag.es",
          ],
          defaultExtended: [],
        },
        kind: {
          any: [],
          0: [],
          10002: [],
          1: [],
        }
      }
    }
  },
  profiles: []
}),

getters: {
  /**
    Pinia getters are essentially computed properties.
    They cannot take parameters directly. However, we can
    return a function from the getter that accepts parameters.

    Example:
      getUsernameByAddressNostr: (state) => {
        return (address) => state.addressToUsernameMapNostr.get(address)
      },

    Then in the component template we can do the following:
      <client-only>
        <div v-if="getUsernameByAddressNostr(author)">
          {{ getUsernameByAddressNostr(author) }}
        </div>
      </client-only>

    Or in the component script setup:
      const username = await getUsernameByAddressNostr.value(author)

    Note that when we do this, getters are not cached anymore,
    they become simple functions that we invoke.
    However, we can cache some results inside the getter itself.
  */
  getMetadataByAddressNostr: (state) => {
    // console.log("getMetadataByAddressNostr called")
    return (
      address: string,
      dataToExtract: DataToExtractFromNostrEventKind0
    ) => {
      // Check environment settings:
      if (!state.enableNostrDisplayProfilesUsernames) {
        if (dataToExtract === "username") return ""
      }

      if (!state.enableNostrDisplayProfilesAbouts) {
        if (dataToExtract === "about") return ""
      }

      if (!state.enableNostrDisplayProfilesWebsites) {
        if (dataToExtract === "website") return ""
      }

      if (!state.enableNostrDisplayProfilesPictures) {
        if (dataToExtract === "picture") return ""
      }

      // Check if address is already linked with a profile.
      let addressProfile = state.profiles.find(
        (profile) => {
          return convertHexOrNpubAddressToNpub(
            profile.id
          ) === convertHexOrNpubAddressToNpub(
          address
          )
        }
      )

      if (
        !addressProfile ||
        typeof(addressProfile) !== "object" ||
        !addressProfile?.nostr?.events?.kind?.[0] ||
        !hasValue(addressProfile?.nostr?.events?.kind?.[0])
      ) { return "" }

      const arrayOfEvents: any[] = addressProfile?.nostr?.events?.kind?.[0]

      if (
        !Array.isArray(arrayOfEvents) ||
        !arrayOfEvents[0]
      ) { return "" }

      const event: NostrEventSignedOpened = arrayOfEvents[0]

      return extractDataFromNostrEvent(event, dataToExtract)
    }
  },

  getProfilesWithPreferredRelays(): ProfileSpasm[] {
    const profilesWithPreferredRelays = this.profiles
                                        .filter((profile) => {
      const eventsOfKind10002 = profile
                                ?.nostr?.events?.kind?.[10002]
      if (
        eventsOfKind10002 &&
        Array.isArray(eventsOfKind10002) &&
        eventsOfKind10002[0] &&
        typeof(eventsOfKind10002[0]) === "object"
      ) {
        if (hasValue(extractDataFromNostrEvent(
          eventsOfKind10002[0],
          "preferredRelays"
        ))) {
          return true
        }
      }
    })
    return profilesWithPreferredRelays
  },

  getAddressesWithPreferredRelays(): string[] {
    const profilesWithPreferredRelays = this.getProfilesWithPreferredRelays
    let addressesWithPreferredRelays: string[] = []
    profilesWithPreferredRelays.forEach((profile) => {
      if (profile?.id && typeof(profile?.id) === "string") {
        pushToArrayIfValueIsUnique(
          addressesWithPreferredRelays,
          profile.id
        )
      }
    })
    return addressesWithPreferredRelays
  },

  getPreferredRelaysFromAddress: (state) => {
    return (address: string): string[] => {
      const addressNpub = convertHexOrNpubAddressToNpub(address)

      // Find existing profile with the same id
      const profile: ProfileSpasm | undefined
        = state.profiles.find(
        profile => profile.id === addressNpub
      )

      if (profile) {
        return getPreferredRelaysFromProfile(profile)
      } else {
        return []
      }
    }
  },

  getMessagesByAddressNostr: (state) => {
    return (address: string): NostrEventSignedOpened[] => {
      const addressNpub = convertHexOrNpubAddressToNpub(address)

      // Find existing profile with the same id
      const profile: ProfileSpasm | undefined = state.profiles.find(
        profile => profile.id === addressNpub
      )

      if (profile) {
        return profile?.nostr?.events?.kind?.[1]
      } else {
        return []
      }
    }
  }
},

actions: {
  /**
   * As addresses show up in the UI, we add them to the list
   * that should be checked once everything is loaded.
   * Once the app is loaded, we trigger an update function,
   * which search for profiles of addresses in the list.
   */
  addAddress(
    address: string,
    // updateType: UpdateType[] = ["username", "relays", "messages"],
    updateType: UpdateType[] = ["username", "relays"],
    protocols: Protocol[] = ["nostr", "ethereum"],
    forceUpdate: boolean = false
  ): void { 
    // console.log("env enableNostrNetwork:", this.enableNostrNetwork)
    // console.log("env enableNostrNetworkFetchProfiles:", this.enableNostrNetworkFetchProfiles)
    // console.log("env enableNostrNetworkFetchPreferredRelays:", this.enableNostrNetworkFetchPreferredRelays)
    // console.log("env enableNostrNetworkFetchMessages:", this.enableNostrNetworkFetchMessages)
    // console.log("env enableNostrNetworkUsePreferredRelays:", this.enableNostrNetworkUsePreferredRelays)
    // console.log("env enableNostrDisplayProfilesUsernames:", this.enableNostrDisplayProfilesUsernames)
    // console.log("env enableNostrDisplayProfilesPictures:", this.enableNostrDisplayProfilesPictures)
    // console.log("env enableNostrDisplayProfilesMessages:", this.enableNostrDisplayProfilesMessages)
    // console.log("env this.addresses.toBeCheckedFor.nostr.relays.default:", this.addresses.toBeCheckedFor.nostr.relays.default)

    // const time = new Date(Date.now()).toISOString();
    // console.log(time, "addAddress called for:", address)

    if (!hasValue(address)) return
    if (typeof(address) !== "string") return

    // Check if address is already linked with a profile.
    let addressProfile = this.profiles.find(
      profile => profile.id === address
    )

    // console.log(time, "addressProfile in addAddress:", addressProfile)

    // Ethereum
    if (
      protocols.includes("ethereum") &&
      // 0x... address
      address.startsWith("0x") && address.length === 42
    ) {

      // ENS
      if (!this.addresses.toBeCheckedFor.ethereum.ens.includes(address)) {

        // Always add an address if forceUpdate is set
        if (
          updateType.includes("username") &&
          forceUpdate
        ) {
          this.addresses.toBeCheckedFor.ethereum.ens.push(address)

        // If forceUpdate is false, then only update addresses
        // that don't yet have a desired property.
        } else {
          if (
            updateType.includes("username") &&
            !addressProfile?.ethereum?.ens
          ) {
            this.addresses.toBeCheckedFor.ethereum.ens.push(address)
          }
        }
      }

    // TODO:
    // Unstoppable Domains
    }

    // Nostr
    if (
      protocols.includes("nostr") &&
      (
        // npub (bech32)
        (address.startsWith("npub") && address.length === 63) ||
        // hex
        (!address.startsWith("npub") && address.length === 64)
      )
    ) {
      // Nostr username (event kind 0 - meta)
      if (!this.addresses.toBeCheckedFor.nostr.kind[0].includes(address)) {
        // Always add an address if forceUpdate is set
        if (
          updateType.includes("username") &&
          forceUpdate
        ) {
          this.addresses.toBeCheckedFor.nostr.kind[0].push(address)

        // If forceUpdate is false, then only update addresses
        // that don't yet have a meta event (username) linked.
        } else {
          if (
            updateType.includes("username") &&
            (
              !Array.isArray(addressProfile?.nostr?.events?.kind?.[0]) ||
              addressProfile?.nostr?.events?.kind?.[0]?.length === 0
            )
          ) {
            this.addresses.toBeCheckedFor.nostr.kind[0].push(address)
          }
        }
      }

      // Nostr preferred relays (event kind 10002)
      if (!this.addresses.toBeCheckedFor.nostr.kind[10002].includes(address)) {
        // Always add an address if forceUpdate is set
        if (
          updateType.includes("relays") &&
          forceUpdate
        ) {
          this.addresses.toBeCheckedFor.nostr.kind[10002].push(address)

        // If forceUpdate is false, then only update addresses
        // that don't yet have preferred relays linked.
        } else {
          if (
            updateType.includes("relays") &&
            (
              !Array.isArray(addressProfile?.nostr?.events?.kind?.[10002]) ||
              addressProfile?.nostr?.events?.kind?.[10002]?.length === 0
            )
          ) {
            this.addresses.toBeCheckedFor.nostr.kind[10002].push(address)
          }
        }
      }

      // Nostr messages (event kind 1 - simple note)
      if (!this.addresses.toBeCheckedFor.nostr.kind[1].includes(address)) {
        // Always add an address if forceUpdate is set
        if (
          updateType.includes("messages") &&
          forceUpdate
        ) {
          this.addresses.toBeCheckedFor.nostr.kind[1].push(address)

        // If forceUpdate is false, then only update addresses
        // that don't yet have a meta event (username) linked.
        } else {
          if (
            updateType.includes("messages") &&
            (
              !Array.isArray(addressProfile?.nostr?.events?.kind?.[1]) ||
              addressProfile?.nostr?.events?.kind?.[1]?.length === 0
            )
          ) {
            this.addresses.toBeCheckedFor.nostr.kind[1].push(address)
          }
        }
      }
    }
  },

  // TODO delete after full transition to V2
  addAddressFromPost(post: Post): void {
    if (
      hasValue(post) &&
      typeof(post) === "object" &&
      'signer' in post &&
      typeof(post.signer) === "string"
    ) {
      this.addAddress(post.signer)
    }
  },

  // TODO delete after full transition to V2
  addAddressesFromPosts(posts: Post[]): void {
    if (!hasValue(posts)) return
    if (!Array.isArray(posts)) return
    posts.forEach((post): void => {
      if (
        hasValue(post) &&
        typeof(post) === "object" &&
        'signer' in post &&
        typeof(post.signer) === "string"
      ) {
        this.addAddressFromPost(post)
      }
    })
  },

  addAddressesFromSpasmEvents(
    unknownEvents: any[]
  ): void {
    const spasmEvents: SpasmEventV2[] | null =
      spasm.toBeSpasmEventsV2(unknownEvents)
    if (
      !spasmEvents || !spasmEvents[0] ||
      !isObjectWithValues(spasmEvents[0])
    ) return

    spasmEvents.forEach((event): void => {
      this.addAddressFromEvent(event)
    })
  },

  addAddressFromEvent(
    unknownEvent: any
  ): void {
    const spasmEvent: SpasmEventV2 | null =
      spasm.toBeSpasmEventV2(unknownEvent)
    if (!spasmEvent || !isObjectWithValues(spasmEvent)) {return}

    const signers: (string | number)[] =
      spasm.getVerifiedSigners(spasmEvent)

    if (isArrayWithValues(signers)) {
      signers.forEach(signer => {
        if (signer) {
          if (typeof(signer) === "string") {
            this.addAddress(signer)
          } else if (typeof(signer) === "number") {
            const signerAsString = String(signer)
            if (signerAsString) {
              this.addAddress(signerAsString)
            }
          }
        }
      })
    }
  },

  async updateAllProfiles(
    // updateType: UpdateType[] = ["username", "relays", "messages"],
    updateType: UpdateType[] = ["relays", "username"],
    protocols: Protocol[] = ["nostr", "ethereum"],
    forceUpdate: boolean = false
  ): Promise<void> {
    // const time = new Date(Date.now()).toISOString();
    // console.log(
    //   time,
    //   "updateAllProfiles called for deepCopyOfObject(this.addresses):",
    //   deepCopyOfObject(this.addresses)
    // )

    // Return early if the update process is already running
    // to avoid concurrent execution, i.e., to prevent sending
    // identical network requests multiple times.
    if (this.isUpdatingProfiles) {
      // console.log("Updating profiles is already running. Aborting...")
      return
    }

    this.isUpdatingProfiles = true

    /**
     * We need to make a deep copy of the object which contains
     * all the lists of the addresses that have to be checked
     * for profile info before executing this function,
     * otherwise new addresses can be concurrently added to the
     * list while this function is still executing, which will
     * mess up the logic.
     * We then should pass the deep copy of this object to all
     * the functions to make sure that only the addresses that
     * have been in the lists at the start of this global update
     * function are being worked on.
     * At the end of the function, we can clean the current state
     * queue from addresses that have been checked during this
     * round of update.
     * The deep copy is necessary to make sure that we don't
     * change the original state queue (this.addresses).
    */
    const queue: Queue = deepCopyOfObject(
      this.addresses.toBeCheckedFor
    )

    if (
      protocols &&
      Array.isArray(protocols) &&
      protocols.includes("ethereum")
    ) {
      // TODO
      // this.updateAllProfilesEthereum()
    }

    if (
      protocols &&
      Array.isArray(protocols) &&
      protocols.includes("nostr") &&
      this.enableNostrNetwork
    ) {
      this.updateAllProfilesNostr(queue, updateType, forceUpdate)
    }

    this.isUpdatingProfiles = false
  },

  async updateAllProfilesNostr(
    queue: Queue | false = false,
    // updateType: UpdateType[] = ["username", "relays", "messages"],
    updateType: UpdateType[] = ["relays", "username"],
    forceUpdate: boolean = false
  ): Promise<void> {
    if (!queue || !(hasValue(queue?.nostr?.kind))) {
      // console.log("The Nostr queue is empty, aborting...")
      return
    }

    // const time = new Date(Date.now()).toISOString();

    if (this.isUpdatingProfilesNostr) {
      // console.log("Updating profiles is already running for Nostr. Aborting...")
      return
    }

    this.isUpdatingProfilesNostr = true

    // Filter out update types which are disabled in .env
    if (!this.enableNostrNetworkFetchProfiles) {
      updateType = updateType.filter(type => type !== "username")
    }

    if (!this.enableNostrNetworkFetchPreferredRelays) {
      updateType = updateType.filter(type => type !== "relays")
    }

    if (!this.enableNostrNetworkFetchMessages) {
      updateType = updateType.filter(type => type !== "messages")
    }

    if (!hasValue(updateType)) return

    // Get all relays
    const defaultRelays: string[] =
      queue.nostr.relays.default

    // console.log(
    //   "deep copy of this.address.toBeCheckedFor.nostr.kind before checking for kinds:",
    //   deepCopyOfObject(this.addresses.toBeCheckedFor.nostr.kind)
    // )

    // console.log(
    //   "queue.nostr.kind before checking for kinds:",
    //   queue.nostr.kind
    // )

    /**
     * Sometimes an address has specified preferred relays via
     * event of kind 10002, but in reality these relays don't
     * hold any events of this address.
     * Thus, we have to check default relays anyways, so we
     * call the function to check for Nostr events with default
     * relays first and then with preferred relays if such
     * relays are specified.
     */

    // Promise all doesn't work properly probably because
    // there is no clear resolve event when using websocket
    // connection with 'nostr-tools' npm package.
    // However, we can add a function with a setInterval that
    // will check whether addresses have preferred relays and
    // send requests if and when such relays are found.
    // Alternatively, we can pass ifAwaitUntilEose flag
    // and resolve only after EOSE.
    // Note that 'await Promise.all' executes concurrently
    // while 'For of ... await' executes sequentially one by one.
    await Promise.all(defaultRelays.map((relay) => {
      // const time = new Date(Date.now()).toISOString();
      // console.log(time, "staring Nostr check for:", relay)
      return this.checkNostrAddressesFromRelaysForData(
        queue,
        [],
        [relay],
        updateType,
        forceUpdate
        // limit
      )
    }))

    // Check addresses with preferred relays
    // Get kinds from updateType.
    let kinds: NostrEventKind[] = []

    updateType.forEach((dataToCheckFor) => {
      let kind: NostrEventKind

      switch (dataToCheckFor) {
        case 'username':
          kind = 0
          break
        case 'relays':
          kind = 10002
          break
        case 'messages':
          kind = 1
          break
      }

      if (!kind && kind !== 0) return

      pushToArrayIfValueIsUnique(kinds, kind)
    })

    // Another approach is to get kinds from object keys.
    // However, this approach includes kinds which are not
    // suppose to be updated during this round of update.
    // For example, if the update function was called for
    // "username" (kind 0) only, we don't need to update
    // "relays" (kind 10002) or "messages" (kind 1).
    // Get the keys (kinds) from the object
    // const kindsFromKeys = Object.keys(
    //   this.addresses.toBeCheckedFor.nostr.kind
    // ) as (
    //   keyof Addresses['toBeCheckedFor']['nostr']['kind']
    // )[]

    // Find all addresses that should be updated.
    let allAddressesToBeChecked: string[] = []

    kinds.forEach((kind) => {
      allAddressesToBeChecked = allAddressesToBeChecked.concat(
        queue.nostr.kind[kind]
      )
      // console.log(
      //   "kind in forEach:", kind,
      //   "addresses:",
      //   this.addresses.toBeCheckedFor.nostr.kind[kind])
    })

    allAddressesToBeChecked = removeNonStringValuesFromArray(
      allAddressesToBeChecked
    )

    allAddressesToBeChecked = removeDuplicatesFromArray(
      allAddressesToBeChecked
    ) as string[]

    // Check again preferred relays
    if (this.enableNostrNetworkUsePreferredRelays) {
      // Check sequentially for each address to avoid
      // connecting to the same relays many times
      // Execute sequentially with await
      for (const address of allAddressesToBeChecked) {
        await this
          .waitAndCheckNostrAddressFromPreferredRelaysForKinds(
          [address],
          // already checked relays:
          defaultRelays,
          kinds,
          forceUpdate,
        )
      }

      // Execute concurrently without await
      // allAddressesToBeChecked.forEach((address) => {
      //   this.waitAndCheckNostrAddressFromPreferredRelaysForKinds(
      //     [address],
      //     // already checked relays:
      //     defaultRelays,
      //     kinds,
      //     forceUpdate,
      //   )
      // })
    }

    // Make sure not to clean default relays at:
    // this.addresses.toBeCheckedFor.nostr.relays
    this.addresses.toBeCheckedFor.nostr.kind = deleteMatchingValuesFromObject(
      this.addresses.toBeCheckedFor.nostr.kind, queue.nostr.kind
    )


    this.isUpdatingProfilesNostr = false
    // console.log(time, "finished updating profiles")
    // console.log(
    //   "deep copy of this.addresses.toBeCheckedFor.nostr.kind[0] when updateAllProfilesNostr is finished:",
    //   deepCopyOfObject(this.addresses.toBeCheckedFor.nostr.kind[0])
    // )
  },

  async checkNostrAddressesFromRelaysForData(
    queue: Queue | false = false,
    addresses: string[] = [],
    relays: string[] = [],
    updateType: UpdateType[] = ["relays", "username"],
    forceUpdate: boolean = false,
    limit: number = 30,
    method: 'concurrently' | 'sequentially' = 'sequentially'
  ) {
    if (!hasValue(updateType)) return

    if (method === 'concurrently') {
      // 'Promise.all' executes concurrently
      await Promise.all(updateType.map((dataType) => {
        return this.checkNostrAddressesFromRelaysForDataType(
          queue, addresses, relays, dataType, forceUpdate, limit
        )
      }))
    // Execute sequentially by default (e.g., if typo)
    } else {
      // 'For of' executes sequentially one by one
      for (const dataType of updateType) {
        await this.checkNostrAddressesFromRelaysForDataType(
          queue, addresses, relays, dataType, forceUpdate, limit
        )
      }
    }
  },

  async checkNostrAddressesFromRelaysForDataType(
    queue: Queue | false = false,
    addresses: string[] = [],
    relays: string[] = [],
    dataType: UpdateType = "username",
    forceUpdate: boolean = false,
    limit: number = 30
  ) {
    let kind: NostrEventKind
    switch (dataType) {
      case 'username':
        kind = 0
        break
      case 'relays':
        kind = 10002
        break
      case 'messages':
        kind = 1
        break
    }

    if (!kind && kind !== 0) return

    let addressesToCheck: string[] = []

    if (hasValue(addresses)) {
      addressesToCheck = addresses
    } else {
      if (queue && hasValue(queue)){
        addressesToCheck = queue.nostr.kind[kind]
      }
    }

    if (
      !hasValue(addressesToCheck) ||
      !isArrayOfStrings(addressesToCheck)
    ) { return }


    if (hasValue(addressesToCheck)) {
      return this.checkNostrAddressesFromRelaysForKinds(
        addressesToCheck,
        relays,
        [kind],
        forceUpdate,
        limit
      )
    }
  },

  async waitAndCheckNostrAddressFromPreferredRelaysForKinds(
      addresses: string[] = [],
      alreadyCheckedRelays: string[] = [],
      kinds: NostrEventKind[] = [],
      forceUpdate: boolean = false,
      limit: number = 100,
  ): Promise<void> {
    const address: string = addresses?.[0]

    if (typeof(address) !== "string") return

    // Option 1.
    // Preferred relays are already found, so subscribe for new
    // events with await and then resolve, so this function
    // can be called multiple times and be executed sequentially.
    let preferredRelays =
      this.getPreferredRelaysFromAddress(address)
    if (isArrayOfStringsWithValues(alreadyCheckedRelays)) {
        preferredRelays = preferredRelays.filter(
          relay => !alreadyCheckedRelays.includes(relay)
        );
    }
    if (hasValue(preferredRelays)) {
      // Subscribe with await
      await this.checkNostrAddressesFromRelaysForKinds(
        [address], preferredRelays, kinds, forceUpdate, limit
      )

    // Option 2.
    // Preferred relays are not found, so set interval to check
    // every second and subscribe for new events without await
    // once preferred relays are found. Resolve immediately
    // after setting an interval. Note that subscriptions will
    // be executed concurrently due to setInterval even if this
    // function is called sequentially.
    } else {
      // Each attempt is 1 second
      let attempts = 0
      const maxAttempts = 10

      const intervalId = setInterval(() => {
        preferredRelays = this.getPreferredRelaysFromAddress(
          address
        )

        // To reduce the amount of new websocket connections,
        // we can filter out preferred relays which have already
        // been checked, e.g. as default relays.
        if (
          hasValue(alreadyCheckedRelays) &&
          isArrayOfStrings(alreadyCheckedRelays)
        ) {
            preferredRelays = preferredRelays.filter(
              relay => !alreadyCheckedRelays.includes(relay)
            );
        }

        if (hasValue(preferredRelays) || attempts > maxAttempts) {
          clearInterval(intervalId)
          if (hasValue(preferredRelays)) {
            // Subscribe without await
            this.checkNostrAddressesFromRelaysForKinds(
              [address], preferredRelays, kinds,
              forceUpdate, limit
            )
          }
        }
        attempts++
      }, 1000)
    }
  },

  async checkNostrAddressesFromRelaysForKinds(
    addresses: string[] = [],
    relays: string[] = [],
    kinds: NostrEventKind[] = [],
    forceUpdate: boolean = false,
    // limit: number = 10
    limit: number = 100
  ): Promise<void> {
    // const time = new Date(Date.now()).toISOString();
    // console.log(
    //   time,
    //   "checkNostrAddressesFromRelaysForKinds called",
    //   "for addresses:",
    //   addresses,
    //   `for relays:`,
    //   relays,
    //   `for kinds:`,
    //   kinds
    // )

    if (!hasValue(addresses)) return

    if (
      !hasValue(addresses) &&
      !hasValue(relays) &&
      !hasValue(kinds)
    ) { return }

    if (
      !Array.isArray(addresses) ||
      !Array.isArray(relays) ||
      !Array.isArray(kinds)
    ) { return }

    // If this address has already been checked for
    // this kind from this relay, then skip it,
    // unless forceUpdate is true.
    // Otherwise we'll check the same addresses
    // against default relays after each global update.
    let addressesToBeChecked: string[] = []

    addresses.forEach((address) => {
      const addressNpub = convertHexOrNpubAddressToNpub(address)

      // Find existing profile with the same id
      const profile = this.profiles.find(
        profile => profile.id === addressNpub
      )

      kinds.forEach((kind) => {
        const relaysCheckedForThisKind = profile
                                         ?.nostr
                                          .relays
                                          .checkedRelays
                                          .checkedForEventsOfKind[kind]

        const relaysThatHaveThisKind = profile
                                        ?.nostr
                                         .relays
                                         .checkedRelays
                                         .hasEventsOfKind[kind]

        relays.forEach((relayUrl) => {
          if (
            relaysCheckedForThisKind?.includes(relayUrl) &&
            !relaysThatHaveThisKind?.includes(relayUrl)
          ) {
            // Don't push, because this address has already been
            // checked with this relay for this event kind.
            // console.log(
            //   time,
            //   "Already checked relayUrl:", relayUrl,
            //   "for kind:", kind,
            //   "for address:", address
            // )

            // Still push if force update is true.
            if (forceUpdate) {
              // console.log("Still pushing because of forceUpdate.")
              pushToArrayIfValueIsUnique(
                addressesToBeChecked, address
              )
            }

          } else {
            // Push address to be checked if unique.
            // console.log(
            //   time,
            //   "Haven't yet checked relayUrl:", relayUrl,
            //   "for kind:", kind,
            //   "for address:", address
            // )
            pushToArrayIfValueIsUnique(
              addressesToBeChecked, address
            )
          }
        })
      })
    })

    // console.log(time, "addressesToBeChecked after:", addressesToBeChecked)

    if (!hasValue(addressesToBeChecked)) return

    // Nostr relays accept only hex, so we have to
    // convert npub or hex addresses into hex only.
    let addressesHex: string[] = convertNpubOrHexAddressesToHex(addressesToBeChecked)
    // let addressesHex: string[] = convertNpubOrHexAddressesToHex(addresses)

    const relayUrl = relays[0]

    // Filter only numbers if 'any' is not present
    let kindsOnlyNumbers: number[] = []
    if (!kinds.includes('any')) {
      kindsOnlyNumbers =
        kinds.filter(el => typeof el === 'number') as number[]
    }
    const filters: NostrNetworkFilter[] = [
      {
        kinds: kindsOnlyNumbers,
        authors: addressesHex,
        limit: limit,
      }
    ]
    const onEventFunction = (event: any, relayUrl: string) => {
      useProfilesStore()
        .handleIncomingNostrEvent(event, relayUrl)
    }
    const config: CustomSubscribeToNostrRelayConfig = {
      filters, onEventFunction
    }

    // If fetching only preferred relays (event kind 10002),
    // then should await until End of Subscription Events (EOSE)
    // to make sure that all preferred relays are received before
    // moving to other functions that might require them, e.g.:
    // - subscribe for kind 10002 (preferred relays)
    // - await until preferred relays are received (EOSE)
    // - subscribe for kind 1 (notes) using preferred relays
    if (
      kindsOnlyNumbers.length === 1 && kindsOnlyNumbers[0] &&
      kindsOnlyNumbers[0] === 10002
    ) { config.ifAwaitUntilEose = true }

    await useNostrRelaysStore()
      .subscribeToNostrRelaysByFilters(relayUrl, config)

    /**
      TODO: old documentation, need to adjust to nostr-tools-v2.
      Note: marking works properly only if an array of relays
      has one relay, because if there are multiple relays, then
      all of them will be marked as checked, but due to a logic
      of how the 'nostr-relays' npm package works, some relays
      will not be marked as hasEventsOfKind[kind] even if they
      actually have events of that kind for the particular
      address.
      Why?
      I'm not sure, but probably because once a few events of
      a certain kind for a certain address are found on at least
      one relay, other relays are not being checked for the same
      kind for the same address.
      I.e., for the whole logic to work properly, it's better
      to call checkNostrAddressesFromRelaysForKinds() with only
      one relay at the time.
    */
    // Mark relays as checked for each kind and for each profile.
    this.markRelaysAsCheckedForAddressesForKinds(
      addresses, relays, kinds
    )
  },

  markRelaysAsCheckedForAddressesForKinds(
    addresses: string[],
    relays: string[],
    kinds: NostrEventKind[]
  ): void {
    if (
      !hasValue(addresses) &&
      !hasValue(relays) &&
      !hasValue(kinds)
    ) { return }

    if (
      !Array.isArray(addresses) ||
      !Array.isArray(relays) ||
      !Array.isArray(kinds)
    ) { return }

    addresses.forEach((address) => {
      const addressNpub = convertHexOrNpubAddressToNpub(address)

      // Find existing profile with the same id
      let index = this.profiles.findIndex(
        profile => profile.id === addressNpub
      )

      // Profile does not exist yet, creating...
      if (index === -1) {
        // Push new empty profile into the array
        const profile = new ProfileSpasm(addressNpub)
        this.profiles.push(profile)
        // Changing index so it points to a new profile
        index = this.profiles.length - 1
      }

      kinds.forEach((kind) => {
        relays.forEach((relayUrl) => {
          pushToArrayIfValueIsUnique(
            this.profiles[index].nostr.relays.checkedRelays
            .checkedForEventsOfKind[kind],
            relayUrl
          )

          pushToArrayIfValueIsUnique(
            this.profiles[index].nostr.relays.checkedRelays
            .checkedForEventsOfKind['any'],
            relayUrl
          )
        })
      })
    })
  },

  handleIncomingNostrEvent(
    event: NostrEventSignedOpened,
    relayUrl?: string
  ): void {
    // const time = new Date(Date.now()).toISOString();
    // console.log(time, "handleIncomingNostrEvent called")
    if (!hasValue(event)) return
    if (typeof(event) !== "object") return

    // Validate an event
    if (!validateEvent(event)) {
      return
    }

    // Verify an event signature
    if (!verifySignature(event)) {
      return
    }

    // Get npub
    let addressNpub: string

    if (
      'pubkey' in event &&
      typeof(event.pubkey) === "string"
    ) {
      addressNpub = convertHexOrNpubAddressToNpub(event.pubkey)
    } else { 
      // Abort if an event has no pubkey (address)
      return
    }

    // Find existing profile with the same id
    let index = this.profiles.findIndex(
      profile => profile.id === addressNpub
    )

    // Profile does not exist yet, creating...
    if (index === -1) {
      // Push new empty profile into the array
      const profile = new ProfileSpasm(addressNpub)
      this.profiles.push(profile)
      // Changing index so it points to a new profile
      index = this.profiles.length - 1
    }

    if (
      'kind' in event &&
      typeof(event.kind) === "number" &&
      (
        event.kind === 0 ||
        event.kind === 10002 ||
        event.kind === 1
      )
    ) {
      const kind = event.kind
      pushToArrayIfValueIsUnique(
        this.profiles[index]
          .nostr.events.kind[kind],
          event
      )
      // this.profiles[index]
      // .nostr.events.kind[kind].push(event)

      // Add a relay url to various lists to avoid using it
      // if it doesn't have events for this address.
      if (relayUrl && typeof(relayUrl) === "string") {
        pushToArrayIfValueIsUnique(
          this.profiles[index].nostr.relays.checkedRelays
          .hasEventsOfKind['any'],
          relayUrl
        )
        pushToArrayIfValueIsUnique(
          this.profiles[index].nostr.relays.checkedRelays
          .hasEventsOfKind[kind],
          relayUrl
        )
      }
    }

    // console.log("this.profiles after all handle:", this.profiles)
    // console.log("===============================")
  },
}
})
