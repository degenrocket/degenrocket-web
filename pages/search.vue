<template>
  <div>
    <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
      Nostr network:
    </div>
    <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
      Filters:
    </div>
    <!-- IDs -->
    <div>
      IDs:
      <textarea
        v-model="filterIds"
        placeholder="note1,note2,3827,4730"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
      />
    </div>

    <!-- Authors -->
    <div>
      Authors:
      <textarea
        v-model="filterAuthors"
        placeholder="npub1,npub2,1234,5678"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
      />
    </div>

    <!-- Kinds -->
    <div>
      Kinds:
      <textarea
        v-model="filterKinds"
        placeholder="0,1,10002"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[40%] max-w-[700px] h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
      />
    </div>

    <!-- #e -->
    <div>
      #e:
      <textarea
        v-model="filterTagsE"
        placeholder="note1,note2,3827,4730"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
      />
    </div>

    <!-- #p -->
    <div>
      #p:
      <textarea
        v-model="filterTagsP"
        placeholder="npub1,npub2,1234,5678"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
      />
    </div>

    <!-- Limit -->
    <div>
      Limit:
      <textarea
        v-model="filterLimit"
        placeholder="10"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[40%] max-w-[700px] h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
      />
    </div>

    <!-- Extra tags -->
    <div>
      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Extra tags:
      </div>
      <!-- Extra tag 1 -->
      <div>
        Tag1 name:
        <textarea
          v-model="filterTagsExtra1Name"
          placeholder="o"
          class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-24 h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
        />
      </div>
      <div>
        Tag1 value:
        <textarea
          v-model="filterTagsExtra1Value"
          placeholder="value1,value2,value3,value4"
          class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[80%] max-w-[700px] h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
        />
      </div>
      <!-- Extra tag 2 -->
      <div>
        Tag2 name:
        <textarea
          v-model="filterTagsExtra2Name"
          placeholder="i"
          class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-24 h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
        />
      </div>
      <div>
        Tag2 value:
        <textarea
          v-model="filterTagsExtra2Value"
          placeholder="value1,value2,value3,value4"
          class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[80%] max-w-[700px] h-8 rounded-b-lg focus:outline-none border-bgSecondary-light dark:border-bgSecondary-dark border"
        />
      </div>
    </div>

    <button
      @click="searchNostrNetwork()"
      class="px-3 py-2 mx-0 mt-2 mb-2 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
    >
      Search on Nostr network
    </button>
    <button
      @click="cleanEventsList()"
      class="ml-2 px-3 py-2 mx-0 mt-2 mb-2 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
    >
      Clean events list
    </button>
    <div v-if="getNostrRelays()">
      Using these Nostr relays:
      <div v-for="relay in getNostrRelays()" class="">
        {{relay}}
      </div>
    </div>
    <div>
      Events:
    </div>
    <div v-if="newEvents && newEvents.length">
      <button
        @click="showNewEvents()"
        class="px-3 py-2 mx-0 mt-2 mb-2 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
      >
        Show new events ({{newEvents.length}})
      </button>
    </div>
    <div v-if="events">
      <InfoEventCommentsCard
        v-for="event in events"
        :key="event.ids?.[0]?.value"
        :comment="event"
        :show-comments-count="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { spasm } from 'spasm.js'
import {
  NostrNetworkFilter,
  NostrEventSignedOpened,
  SpasmEventV2,
  CustomSubscribeToNostrRelayConfig,
CustomNostrRelayOnEventFunction
} from '@/helpers/interfaces';
import {useNostrRelaysStore} from '@/stores/useNostrRelaysStore'
import {useProfilesStore} from '@/stores/useProfilesStore';
const {
  getNostrRelays,
  toBeHex
} = useNostr()
const {
  isArrayWithValues,
  isObjectWithValues,
  isValidSpasmEventV2,
  wait,
} = useUtils()

const filterIds = ref('')
const filterAuthors = ref('')
const filterKinds = ref('')
const filterTagsE = ref('')
const filterTagsP = ref('')
const filterTagsExtra1Name = ref('')
const filterTagsExtra1Value = ref('')
const filterTagsExtra2Name = ref('')
const filterTagsExtra2Value = ref('')
const filterLimit = ref('')
let events = ref<SpasmEventV2[]>([])
let newEvents = ref<SpasmEventV2[]>([])

const searchNostrNetwork = async (
): Promise<void> => {
  console.log("searching")
  const filter: NostrNetworkFilter = {}

  const ids: string[] = []
  if (filterIds.value && typeof(filterIds.value) === "string") {
    const rawIds: (string | number)[] | null =
      filterIds.value.toLowerCase().split(',')
    if (rawIds && isArrayWithValues(rawIds)) {
      rawIds.forEach(rawId => {
        const str = toBeHex(String(rawId))
        if (str && typeof(str) === "string") {
          // TODO standardize id
          ids.push(str.trim())
        }
      })
    }
  }
  if (isArrayWithValues(ids)) { filter.ids = ids }

  const authors: string[] = []
  if (
    filterAuthors.value &&
    typeof(filterAuthors.value) === "string"
  ) {
    const rawAuthors: (string | number)[] | null =
      filterAuthors.value.toLowerCase().split(',')
    if (rawAuthors && isArrayWithValues(rawAuthors)) {
      rawAuthors.forEach(rawAuthor => {
        const str = toBeHex(String(rawAuthor))
        if (str && typeof(str) === "string") {
          // TODO standardize authors
          authors.push(str.trim())
        }
      })
    }
  }
  if (isArrayWithValues(authors)) { filter.authors = authors }

  const kinds: number[] = []
  if (
    filterKinds.value && typeof(filterKinds.value) === "string"
  ) {
    const rawKinds: (string | number)[] | null =
      filterKinds.value.toLowerCase().split(',')
    if (rawKinds && isArrayWithValues(rawKinds)) {
      rawKinds.forEach(rawKind => {
        const num = Number(rawKind)
        if (typeof(num) === "number") {
          kinds.push(num)
        }
      })
    }
  }
  /* if (isArrayWithValues(kinds)) { filter.kinds = kinds } */
  if (
    Array.isArray(kinds) && typeof(kinds[0]) === "number"
  ) { filter.kinds = kinds }

  const tagsE: string[] = []
  if (
    filterTagsE.value &&
    typeof(filterTagsE.value) === "string"
  ) {
    const rawValues: (string | number)[] | null =
      filterTagsE.value.toLowerCase().split(',')
    if (rawValues && isArrayWithValues(rawValues)) {
      rawValues.forEach(rawValue => {
        const str = toBeHex(String(rawValue))
        if (str && typeof(str) === "string") {
          // TODO standardize ids
          tagsE.push(str.trim())
        }
      })
    }
  }
  if (isArrayWithValues(tagsE)) {
    filter["#e"] = tagsE
  }

  const tagsP: string[] = []
  if (
    filterTagsP.value &&
    typeof(filterTagsP.value) === "string"
  ) {
    const rawValues: (string | number)[] | null =
      filterTagsP.value.toLowerCase().split(',')
    if (rawValues && isArrayWithValues(rawValues)) {
      rawValues.forEach(rawValue => {
        const str = toBeHex(String(rawValue))
        if (str && typeof(str) === "string") {
          // TODO standardize addresses
          tagsP.push(str.trim())
        }
      })
    }
  }
  if (isArrayWithValues(tagsP)) {
    filter["#p"] = tagsP
  }

  const tagsExtra1: string[] = []
  if (
    filterTagsExtra1Value.value &&
    typeof(filterTagsExtra1Value.value) === "string"
  ) {
    const rawValues: (string | number)[] | null =
      /* filterTagsExtra1Value.value.toLowerCase().split(',') */
      filterTagsExtra1Value.value.split(',')
    if (rawValues && isArrayWithValues(rawValues)) {
      rawValues.forEach(rawValue => {
        const str = String(rawValue)
        if (str && typeof(str) === "string") {
          // TODO standardize addresses
          tagsExtra1.push(str.trim())
        }
      })
    }
  }
  if (
    filterTagsExtra1Name.value &&
    String(filterTagsExtra1Name.value) &&
    isArrayWithValues(tagsExtra1)
  ) {
    const filterName =
      "#" + String(filterTagsExtra1Name.value).trim()
    filter[filterName] = tagsExtra1
  }

  const tagsExtra2: string[] = []
  if (
    filterTagsExtra1Value.value &&
    typeof(filterTagsExtra1Value.value) === "string"
  ) {
    const rawValues: (string | number)[] | null =
      /* filterTagsExtra2Value.value.toLowerCase().split(',') */
      filterTagsExtra2Value.value.split(',')
    if (rawValues && isArrayWithValues(rawValues)) {
      rawValues.forEach(rawValue => {
        const str = String(rawValue)
        if (str && typeof(str) === "string") {
          // TODO standardize addresses
          tagsExtra2.push(str.trim())
        }
      })
    }
  }
  if (
    filterTagsExtra2Name.value &&
    String(filterTagsExtra1Name.value) &&
    isArrayWithValues(tagsExtra2)
  ) {
    const filterName =
      "#" + String(filterTagsExtra2Name.value).trim()
    filter[filterName] = tagsExtra2
  }

  let limit = 20
  if (
    filterLimit.value &&
    typeof(filterLimit.value) === "string"
    ) {
    const num = Number(filterLimit.value)
    if (num && typeof(num) === "number") {
      limit = num
    }
  }
  if (limit && typeof(limit) === "number") {
    filter.limit = limit
  }

  const relays: string[] | null = getNostrRelays()
  if (!relays) return

  console.log("filter:", filter)
  await searchNostrNetworkByFilters(filter, relays)
}

const searchNostrNetworkByFilters = async (
  filter: NostrNetworkFilter,
  relays: string[],
): Promise<NostrEventSignedOpened | null> => {
  if (!filter) return null
  if (!isObjectWithValues(filter)) return null
  if (!relays) return null
  if (!isArrayWithValues(relays)) return null

  const onEventFunction: CustomNostrRelayOnEventFunction = (
    event: any, _: string, ifAfterEose: boolean
  ) => {
    console.log("onEventFunction:", event.kind, _, ifAfterEose)
    const spasmEventV2: SpasmEventV2 | null =
      spasm.convertToSpasm(event)
    if (spasmEventV2 && isValidSpasmEventV2(spasmEventV2)) {
      if (!ifAfterEose) {
        spasm.appendToArrayIfEventIsUnique(
          events.value, spasmEventV2
        )
      } else {
        const ifDuplicate = spasm
          .checkIfArrayHasThisEvent(events.value, spasmEventV2)
        if (!ifDuplicate) {
          spasm.prependToArrayIfEventIsUnique(
            newEvents.value, spasmEventV2
          )
        }
      }
    }
  }
  const onEoseFunction = (
    relayUrl: string, totalEventsFound: number
  ) => {
    console.log(relayUrl, "eose, found events:", totalEventsFound)
  }

  try {
    const config: CustomSubscribeToNostrRelayConfig = {
      filters: [filter],
      onEventFunction,
      onEoseFunction,
      // Keeping sub open after EOSE for 60 sec to test new events
      ifCloseSubOnEose: false,
      closeSubAfterTime: 60000,
      // Await until EOSE before executing updateAllProfiles()
      // to get usernames for all new addresses.
      ifAwaitUntilEose: true
    }
    const relayUrls: string[] = relays
    await useNostrRelaysStore()
      .subscribeToNostrRelaysByFilters(
        relayUrls, config,
      )

    await wait(5000)

    await useProfilesStore()
      .updateAllProfiles(["relays", "username"])
  } catch (err) {
    console.error('error in Nostr relay connection', err);
  }
  return null
}

const cleanEventsList = () => {
  events.value = []
  newEvents.value = []
}

const showNewEvents = async (
): Promise<void> => {
  // slice() creates a shallow copy of the array
  // to avoid modifying the original one
  newEvents?.value?.slice().reverse().forEach(
    (newEvent: SpasmEventV2) => {
      spasm.prependToArrayIfEventIsUnique(
        events.value, newEvent
      )

    }
  )
  newEvents.value = []
}

</script>

<style scoped>

</style>
