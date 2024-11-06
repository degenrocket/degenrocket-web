import {defineStore} from 'pinia'
import {useFetch} from '#app'
import {
  FeedFilters,
  NostrEventSignedOpened,
  ProfileSpasm,
  SpasmEventV2,
  NostrNetworkFiltersConfig
} from '@/helpers/interfaces'

import {useProfilesStore} from '@/stores/useProfilesStore'
import { spasm } from 'spasm.js'
import {RelayPool} from "nostr-relaypool";
// const profilesStore = useProfilesStore()

const {feedFilters} = useFeedEventsFilters()
// const {logPosts, logTime} = useLog()
const {
  hasValue,
  isValidSpasmEventV2,
  areValidSpasmEventsV2,
  isArrayWithValues,
  isArrayOfStrings,
  isObjectWithValues,
  isStringOrNumber,
  sanitizeObjectValuesWithDompurify
} = useUtils()
const {
  getMockEvents,
  // getMockCommentsById
} = useMocks()

const {
  assembleNostrNetworkFilters,
  getNostrRelays,
  toBeHex
} = useNostr()

export interface PostsState {
  apiUrl: any
  useMockedDataIfBackendIsDown: any
  feedFiltersActivityHot: any
  feedFiltersActivityRising: any
  enableShortUrlsForWeb3Actions: any
  shortUrlsLengthOfWeb3Ids: any
  allPosts: SpasmEventV2[]
  // TODO delete after testing
  eventComments: SpasmEventV2[]
  displayFilters: FeedFilters
  selectedIds: Array<string | number | null | undefined>
  fetchingPostsByFilters: boolean
  currentEventId: (string | number) | null
}

// console.log = () => {}

export const useEventsStore = defineStore('postsStore', {
  state: (): PostsState => ({
    // Environment settings:
    apiUrl: useRuntimeConfig()?.public?.apiURL,
    useMockedDataIfBackendIsDown: useRuntimeConfig()?.public?.useMockedDataIfBackendIsDown === "true" ? true : false,
    feedFiltersActivityHot: Number(useRuntimeConfig()?.public?.feedFiltersActivityHot) || 5,
    feedFiltersActivityRising: Number(useRuntimeConfig()?.public?.feedFiltersActivityRising) || 3,

    // Short IDs
    enableShortUrlsForWeb3Actions: useRuntimeConfig()?.public?.enableShortUrlsForWeb3Actions === "true" ? true : false,
    shortUrlsLengthOfWeb3Ids: Number(useRuntimeConfig()?.public?.shortUrlsLengthOfWeb3Ids) || 20,

    // appPosts contains all posts fetched from the server,
    // sorted by date and cleaned from duplicates.
    allPosts: [],

    // postComments contains all comments for the current post
    // TODO delete after testing
    eventComments: [],

    // Display filters are used by getters to display posts.
    // Display filters are manually updated after saving newly
    // fetched posts into the store in order to prevent blinking.
    // If use feedFilters instead, then after changing filters,
    // posts from the store will be shown in the feed for a short
    // time before being replaced by newly fetched posts.
    displayFilters: {},
    selectedIds: [],
    fetchingPostsByFilters: false,
    currentEventId: null
  }),

  getters: {
    getPosts(): SpasmEventV2[] {
      const filteredEvents = this.filterEvents(this.displayFilters)
      if (filteredEvents && isArrayWithValues(filteredEvents)) {
        return filteredEvents
      } else {
        return []
      }
    },

    getPost(): SpasmEventV2 | null {
      if (
        !this.currentEventId ||
        !isStringOrNumber(this.currentEventId)
      ) { return null }

      const id = this.currentEventId.toString()
      let event: SpasmEventV2 | null = null

      if (
        this.enableShortUrlsForWeb3Actions &&
        this.shortUrlsLengthOfWeb3Ids &&
        typeof(this.shortUrlsLengthOfWeb3Ids) === "number"
      ) {
        event = spasm.getEventById(
          this.allPosts, id, this.shortUrlsLengthOfWeb3Ids
        )
      } else {
        event = spasm.getEventById(this.allPosts, id)
      }

      if (event && isValidSpasmEventV2(event)) {
        return event
      } else {
        return null
      }
    },

    // TODO detele after testing
    getPostComments(): SpasmEventV2[] {
      return this.eventComments
    },
  },

  actions: {
    async fetchPostsByFilters(
      customFilters?: FeedFilters
    ): Promise<void> {
      if (!this.apiUrl) { return }

      this.fetchingPostsByFilters = true

      const path = this.apiUrl + '/api/events'

      // It's necessary to copy filters into another object,
      // because otherwise there is some bug with useFetch()
      // when used together with watch(), which increases
      // an amount of fetch requests after each change of filters.
      let filters = {}
      if (isObjectWithValues(customFilters)) {
        filters = {...customFilters}
      } else {
        // If no custom filters were passed, then
        // use filters from useFeedFilters() composable.
        filters = {...feedFilters}
      }

      const {data: fetchedEvents, error} = await useFetch(path, {
        // query: filtersQuery, watch: useFeedFilters().feedFilters
        query: filters
      })

      if (error.value) {
        console.error("Errors during fetch:", error.value)
      }

      const spasmEvents: SpasmEventV2[] | null =
        isArrayWithValues(fetchedEvents.value)
        ? spasm.convertManyToSpasm(fetchedEvents.value)
        : null

      if (spasmEvents && isArrayWithValues(spasmEvents)) {
        this.saveEventsToStore(spasmEvents)
      }

      // Testing locally with mocked data if enabled in .env file
      if (
        this.useMockedDataIfBackendIsDown &&
        !isArrayWithValues(fetchedEvents.value)
      ) {
        const mockedEvents = getMockEvents()
        this.saveEventsToStore(mockedEvents)
      }

      this.displayEvents(filters)
      this.fetchingPostsByFilters = false

      // By this time almost all addresses from newly fetched
      // posts and comments should already be in the list of
      // addresses that should be checked for profile info
      // (e.g., username, about, pfp), so we can call the
      // global update function.
      const profilesStore = useProfilesStore()
      profilesStore.updateAllProfiles()

      // console.log(logTime(), "\nAll fetching is finished, displayFilters updated", "\n=======/")
    },

    async fetchAndSaveEventsByIds(
      ids: (string | number)[] | null
    ): Promise<SpasmEventV2[]> {
      if (!ids || !Array.isArray(ids)) { return [] }
      const fetchedEvents: SpasmEventV2[] = []

      // Execute sequentially one by one
      for (const id of ids) {
        const event = await this.fetchEventById(id)
        if (event) { fetchedEvents.push(event) }
      }

      if (!fetchedEvents || !hasValue(fetchedEvents)) {return []}

      this.saveEventsToStore(fetchedEvents)

      return fetchedEvents
    },

    async fetchEventById(
      id: (string | number) | null
    ): Promise<SpasmEventV2 | null> {
      if (!id) return null
      if (!this.apiUrl) return null
      if (!isStringOrNumber(id)) return null

      const path = this.apiUrl + '/api/events/search?e=' + id
      const {data: fetchedResult, error} = await useFetch(path)

      if (error.value) {
        console.error(error.value)
        return null
      }

      if (
        fetchedResult &&
        isObjectWithValues(fetchedResult) &&
        fetchedResult.value &&
        isObjectWithValues(fetchedResult.value)
      ) {
        const spasmEvent: SpasmEventV2 | null =
          spasm.convertToSpasm(fetchedResult.value)
        if (spasmEvent) {
          return spasmEvent
        } else { return null }
      } else { return null }
    },

    async fetchAndSaveEventsWithCommentsByIds(
      ids: (string | number)[] | null,
      commentsDepth: number = 10
    ): Promise<SpasmEventV2[]> {
      if (!ids || !Array.isArray(ids)) { return [] }
      const fetchedEvents: SpasmEventV2[] = []

      // Execute sequentially one by one
      for (const id of ids) {
        const event = await this.fetchEventWithCommentsById(
          id, commentsDepth
        )
        if (event) { fetchedEvents.push(event) }
      }

      if (!fetchedEvents || !hasValue(fetchedEvents)) {return []}

      this.saveEventsToStore(fetchedEvents)

      // Add addresses to a list of addresses that should be checked
      // for profile info (e.g. usernames) during an update function.
      const profilesStore = useProfilesStore()
      profilesStore.addAddressesFromSpasmEvents(fetchedEvents)

      return fetchedEvents
    },

    async fetchEventWithCommentsById(
      id: (string | number) | null,
      commentsDepth: number = 10
    ): Promise<SpasmEventV2 | null> {
      if (!id) return null
      if (!this.apiUrl) return null
      if (!isStringOrNumber(id)) return null

      const path =
        this.apiUrl +
        '/api/events/search?e=' + id +
        '&commentsDepth=' + commentsDepth
      const {data: fetchedResult, error} = await useFetch(path)

      if (error.value) {
        console.error(error.value)
        return null
      }

      if (
        fetchedResult &&
        isObjectWithValues(fetchedResult) &&
        fetchedResult.value &&
        isObjectWithValues(fetchedResult.value)
      ) {
        // Error
        if (
          "error" in fetchedResult.value &&
          fetchedResult.value.error &&
          typeof(fetchedResult.value.error) === "string"
        ) {
          return null
        // Not error
        } else {
          const spasmEvent: SpasmEventV2 | null =
            spasm.convertToSpasm(fetchedResult.value)
          if (spasmEvent) {
            return spasmEvent
          } else { return null }
        }
      } else { return null }
    },

    saveEventsToStore(events: SpasmEventV2[] | null): boolean {
      if (
        !events || !isArrayWithValues(events) ||
        !events?.length || !events?.[0] ||
        !areValidSpasmEventsV2(events)
      ) {return false}

      const concatEvents = events.concat(this.allPosts)

      const mergedEvents =
        spasm.mergeDifferentSpasmEventsV2(concatEvents)

      const sortedEvents =
        spasm.sortSpasmEventsV2ByDbAddedTimestamp(mergedEvents)

      this.allPosts = sortedEvents

      // Add addresses to a list of addresses that should
      // be checked for profile info (e.g. usernames) during
      // an update function.
      // Currently calling the addAddresses function only on the
      // client-side, because calling it during the server-side
      // rendering (SSR) gives an error due to accessing
      // env vars via useRuntimeConfig() in useProfilesStore().
      // Calling it only on the client-side means that some
      // addresses will be missed, but we are also adding all
      // addresses to the queue when they are rendered in the
      // UI within (process.client).
      if (process.client) {
        const profilesStore = useProfilesStore()
        profilesStore.addAddressesFromSpasmEvents(this.allPosts)
      }

      return true
    },

    // Filters should be applied at the end of fetching,
    // because there is a time gap between user's click to change
    // active filters and new events being ready to be shown due to
    // fetching that can sometimes take up to a few seconds.
    displayEvents(filters: FeedFilters): void {
      this.displayFilters = filters
    },

    // removeDuplicates(posts?: Post[]): Post[] {
    //   // Filter out duplicate posts based on post ids
    //   // console.log("Removing duplicates:", logPosts(posts))
    //
    //   if (!posts?.length || !posts?.[0]) {return []}
    //
    //   // In some edge cases posts might not have ids, so we can
    //   // remove duplicates based on signatures and then on ids.
    //   // The function can also be used to remove duplicates based
    //   // on other properties such as url or guid.
    //   // type PostProperty = "signature" | "id" | "guid" | "url"
    //
    //   // Duplicates usually occur after fetching new posts,
    //   // if same posts have already been fetched and saved before.
    //   // type PropertyValue = string | number | boolean | null | undefined
    //   // const removeDuplicatesByProperty = (
    //   //   posts: Post[], property: PostProperty
    //   // ): Post[] => {
    //   //   // Get an array of non-unique ids, signatures, etc.
    //   //   // E.g., [101, 103, 102, 101, 101, 105, 105]
    //   //   const arrayOfNonUniqueProperties: PropertyValue[] = posts.map(
    //   //     (mapPost): PropertyValue => {
    //   //       return mapPost?.[property]
    //   //     }
    //   //   )
    //   //
    //   //   // Filter out duplicates.
    //   //   posts = posts.filter((post, index): boolean => {
    //   //     // Keep the post if it has no searched property (sig/id)
    //   //     if (!post?.[property]) {return true}
    //   //
    //   //     const firstIndexOfPostProperty = arrayOfNonUniqueProperties.indexOf(post?.[property])
    //   //
    //   //     const isPostUnique = firstIndexOfPostProperty === index
    //   //
    //   //     return isPostUnique
    //   //   })
    //   //
    //   //   return posts
    //   // }
    //
    //   // posts = removeDuplicatesByProperty(posts, "signature")
    //   // posts = removeDuplicatesByProperty(posts, "id")
    //
    //   posts.forEach(post => {
    //     const spasmId = spasm.extractSpasmId01(post)
    //     console.log("post.title:", post.title)
    //     console.log("spasmId:", spasmId)
    //     console.log("post:", post)
    //   })
    //
    //   return posts
    // },

    // Sort posts chronologically.
    // web2 posts have .pubdate, while web3 posts have .added_time
    // thus, we can either normalize the data or use this solution:
    // sortPostsByDate(posts?: Post[]) {
    //   if (!posts?.length || !posts?.[0]) {return []}
    //
    //   // Posts without date can mess up sorting and even cause
    //   // hydration mismatch, so they are moved into separate
    //   // array, which is added back (via concat) after sorting.
    //   let postsWithoutDate: Post[] = []
    //   posts = posts.filter((post: Post): boolean => {
    //     if (post.added_time || post.pubdate) {
    //       return true
    //     }
    //     postsWithoutDate.push(post)
    //     return false
    //   })
    //
    //   // For web3 posts the added_time param is chosen for sorting
    //   // instead of signed_time for multiple reasons:
    //   // 1. signed_time can be set manually by the signer (user),
    //   //    so it can be far in the future or in the past.
    //   // 2. It can take a long time for a web3 post to arrive to
    //   //    the current instance of the network, so if signed_time
    //   //    was used, then the web3 post could appear at the
    //   //    bottom of the feed. Thus, added_time is preferred.
    //   posts.sort((a, b): number => {
    //     if (a.pubdate && b.pubdate) {
    //       return b.pubdate.localeCompare(a.pubdate)
    //     } else if (a.pubdate && b.added_time) {
    //       return b.added_time.localeCompare(a.pubdate)
    //     } else if (a.added_time && b.added_time) {
    //       return b.added_time.localeCompare(a.added_time)
    //     } else if (a.added_time && b.pubdate) {
    //       return b.pubdate.localeCompare(a.added_time)
    //     }
    //     // Ideally, return 1 should never happen because
    //     // we've filtered out posts without date above.
    //     // In case if we missed some scenarios,
    //     // then 'return 1' should push an element without date
    //     // to the end of the array, but it can still
    //     // mess up the sorting.
    //     return 1
    //   });
    //
    //   posts = posts.concat(postsWithoutDate)
    //   return posts
    // },

    filterEvents(
      filters?: FeedFilters,
      spasmEvents?: SpasmEventV2[]
    ): SpasmEventV2[] {

      spasmEvents = spasmEvents || this.allPosts || []

      if (!filters) {return spasmEvents}

      // TODO: implement web2/web3 filter
      // check if signature exist, then web3
      // otherwise web2.
      // Add web2/3 toggle to feed menu for test.

      const filterByCategory = (
        spasmEvent: SpasmEventV2
      ): boolean => {
        if (!filters?.category) return true
        if (filters?.category === 'any') return true
        if (
          "categories" in spasmEvent && spasmEvent.categories
        ) {
          // Currently, only the first category is counted to
          // prevent users from adding too many categories.
          if (
            spasmEvent.categories[0].name === filters.category
          ) {
            return true
          }
        }
        return false
      }

      const filterByActivity = (
        spasmEvent: SpasmEventV2
      ): boolean => {
        let value = 0
        if (filters.activity === "hot") {
          value = this.feedFiltersActivityHot || 5
        } else if (filters.activity === "rising") {
          value = this.feedFiltersActivityRising || 3
        } else {
          return true
        }

        const total =
          spasm.getTotalOfReact(spasmEvent)
          // API is currently defining activity by the total
          // number of all reactions, so using getTotalOfReact().
          // Another approach is to change API and then use:
          // spasm.getTotalOfMostPopularReaction(spasmEvent)

        if (total >= value) { return true }

        return false
      }

      let filteredEvents: SpasmEventV2[] | null =
        spasmEvents.filter(function (event) {
        if (filterByCategory(event)
          && filterByActivity(event)) {
          return event;
        }
      })

      if (
        !filteredEvents || !Array.isArray(filteredEvents)
      ) { return spasmEvents }

      // TODO delete after testing.
      // This should be solved in V2 since all events are stored
      // in the same table.
      // Old approach:
      // Since web2 and web3 posts are fetched together, it's
      // necessary to limit the amount of posts shown in the feed
      // otherwise all posts from the store will be shown, which
      // can mess up chronological order and posts can jump around
      // the feed after resorting after fetching new posts. 
      // if (typeof filters?.limitWeb2 === 'number'
      //   && typeof filters?.limitWeb3 === 'number') {
      //   let numberOfPostsToDisplay: number = 10
      //   // Choosing the smallest limit as the number of posts to be
      //   // displayed in the feed provides chronological order of
      //   // posts after sorting in most cases.
      //   // Ideally, all limits should be equal to provide the best
      //   // chronological order. (eg. limitWeb2 and limitWeb3 = 40)
      //   // However, in that case a lot of posts will be fetched
      //   // from the server and saved in the store, without
      //   // displaying them to a user in the feed.
      //   // (Downside: higher traffic load).
      //   if (filters.limitWeb2 < filters.limitWeb3) {
      //     numberOfPostsToDisplay = filters.limitWeb2
      //   } else {
      //     numberOfPostsToDisplay = filters.limitWeb3
      //   }
      //   filteredEvents.splice(numberOfPostsToDisplay)
      // }

      // Prepend selected posts to be shown on top of the feed,
      // if such posts are not shown anywhere else in the feed.
      // For example, when a user opens a website with a link to
      // a specific post, which has been published a long time ago
      // and as a result it doesn't show up in the feed.

      // Step 1.
      // Find ids of events which are selected,
      // but don't satisfy active feed filters.
      let selectedIdsNotDisplayed: (string | number)[] = []

      this.selectedIds.forEach((selectedId) => {
        if (selectedId && filteredEvents) {
          const foundEvent: SpasmEventV2 | null | undefined =
            filteredEvents.find(event => {
            return spasm.checkIfEventHasThisId(event, selectedId)
          })
          if (!foundEvent) {
            selectedIdsNotDisplayed.push(selectedId)
          }
        }
      })

      // Step 2.
      // Get posts from the store of ids that don't satisfy filters
      let stickyPosts: SpasmEventV2[] = []

      if (selectedIdsNotDisplayed?.length > 0) {
        const foundEvents: SpasmEventV2[] | null =
          spasm.getEventsByIds(
          this.allPosts, selectedIdsNotDisplayed
        )
        if (foundEvents) { stickyPosts = foundEvents }
      }

      // Step 3.
      // Prepend sticky posts to filtered posts.
      return stickyPosts.concat(filteredEvents)
    },

    setSelectedIds(
      ids: (string | number) | (string | number)[]
    ): void {
      let arrayOfIds: (string | number)[] = []

      // Concat converts string or number into array
      arrayOfIds = arrayOfIds.concat(ids)

      this.selectedIds = arrayOfIds
    },

    setCurrentPostId(id: (string | number)): void {
      if (!id || !isStringOrNumber(id)) return
      let newId = String(id)
      if (newId.length === 63 && newId.startsWith('note')) {
        const hex = toBeHex(newId)
        if (hex && typeof(hex) === "string") { newId = hex } 
      }
      this.currentEventId = newId
    },

    async updateCurrentPost():Promise<void> {
      if (this.currentEventId) {
        await this.fetchAndSaveEventsByIds([this.currentEventId])
      }
    },

    // getPostsByIds(ids: PostId | PostId[]): Post[] {
    //   // console.log("Need to get posts: ", ids)
    //
    //   // Concat converts string or number into an array
    //   let arrayOfIds: PostId[] = []
    //   arrayOfIds = arrayOfIds.concat(ids)
    //   // console.log("arrayOfIds in getPostsByIds:", arrayOfIds)
    //
    //   // Search can be done by signature, url, and id
    //   const posts = this.allPosts.filter(
    //     i => arrayOfIds.includes(i.signature)
    //     || arrayOfIds.includes(i.url)
    //     || arrayOfIds.includes(i.id?.toString())
    //   );
    //
    //   // console.log("return posts in getPostsByIds:", posts)
    //   return posts
    // },

    getPostsByShortId(
      shortId: string | number
    ): SpasmEventV2[] {
      try {
        if (!shortId) { return [] }
        const events: SpasmEventV2[] = []
        this.allPosts.forEach(event => {
          const eventIds: (string | number)[] | null =
            spasm.getAllEventIds(event)
          if (eventIds && Array.isArray(eventIds)) {
            eventIds.forEach(id => {
              if (String(id).startsWith(String(shortId))) {
                events.push(event)
              }
            })
          }
        })
        return events
      } catch (err) {
        console.error(err);
        return []
      }
    },

    async getOrFetchPostsByIds(
      ids: (string | number) | (string | number)[]
    // ): Promise<SpasmEventV2[] | { error: string }[]> {
    ): Promise<SpasmEventV2[] | null> {

      // Concat converts string or number into array
      let arrayOfIds: (string | number)[] = []
      arrayOfIds = arrayOfIds.concat(ids)

      if (!this.selectedIds?.[0]) {
        // console.log("no selected ids, time to select some")
        this.setSelectedIds(arrayOfIds)
      }

      const eventsFromStore: SpasmEventV2[] | null =
        spasm.getEventsByIds(this.allPosts, arrayOfIds)

      // Fetch events from server if they aren't in the store
      if (
        !eventsFromStore ||
        !isArrayWithValues(eventsFromStore) ||
        (
          eventsFromStore && Array.isArray(eventsFromStore) &&
          isArrayWithValues(eventsFromStore) &&
          eventsFromStore.length < arrayOfIds.length
        )
      ) {
        const eventsFromServer =
          await this.fetchAndSaveEventsByIds(arrayOfIds)
        return eventsFromServer
      } else {
        // console.log("All posts were found in the store")
      }
      if (
        eventsFromStore && isArrayWithValues(eventsFromStore)
      ) {
        return eventsFromStore
      } else { 
        return null
      }
    },

    async updateEventComments(id: string | number): Promise<void> {
      if (!id || !isStringOrNumber(id)) { return }
      const eventWithComments =
        await this.fetchEventWithCommentsById(id)
      if (
        eventWithComments &&
        isObjectWithValues(eventWithComments)
      ) {
        this.saveEventsToStore([eventWithComments])
      }

      // Add addresses to a list of addresses that should be checked
      // for profile info (e.g. usernames) during an update function.
      const profilesStore = useProfilesStore()
      profilesStore.addAddressesFromSpasmEvents([eventWithComments])
    },

    async fetchFromNostrNetworkByIds(
      ids: string[],
      customRelays?: string[] | null,
      profile?: ProfileSpasm
    ): Promise<NostrEventSignedOpened | null> {
      return this.fetchFromNostrNetworkByFilters(
        {ids: ids}, customRelays, profile
      )
    },

    async fetchFromNostrNetworkByFilters(
      filtersConfig: NostrNetworkFiltersConfig,
      customRelays?: string[] | null,
      profile?: ProfileSpasm
    ): Promise<NostrEventSignedOpened | null> {
      const filters = assembleNostrNetworkFilters(filtersConfig)
      if (!filters) return null
      if (!isObjectWithValues(filters)) return null

      let relays: string[] | null
      if (
        customRelays && hasValue(customRelays) &&
        isArrayOfStrings(customRelays)
      ) {
        relays = customRelays
      } else {
        relays = getNostrRelays(profile)
      }
      if (!relays || !isArrayWithValues(relays)) return null
      console.log("relays:", relays)

      let relayPool = new RelayPool(relays);
      relayPool.subscribe(
        [filters],
        relays,

        // onEvent
        // (event, isAfterEose, relayUrl) => {
        (event, _, relayUrl) => {
          sanitizeObjectValuesWithDompurify(event)

          // console.log(event, relayUrl)

          // const eventsStore = useEventsStore()
          const spasmEventV2: SpasmEventV2 | null =
            spasm.convertToSpasm(event)
          if (spasmEventV2 && isValidSpasmEventV2(spasmEventV2)) {
            // eventsStore.saveEventsToStore([spasmEventV2])
            this.saveEventsToStore([spasmEventV2])
          }
          // if (process.client) {}
        },

        // maxDelayms (doesn't work with onEose)
        undefined,

        // onEose - End Of Subscription Events (EOSE)
        // (relayUrl, minCreatedAt) => {
        (_, __) => {}
      );

      relayPool.onerror((err, relayUrl) => {
        console.error("RelayPool error", err, " from relay ", relayUrl);
      });
      relayPool.onnotice((relayUrl, notice) => {
        console.error("RelayPool notice", notice, " from relay ", relayUrl);
      });

      return null
    }
  }
})
