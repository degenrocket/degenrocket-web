export type FiltersActivity = "hot" | "rising" | "all";

export type FiltersCategory = "defi" | "nft" | "privacy" | "any";

export interface FeedFilters {
  webType?: string | boolean
  category?: FiltersCategory | boolean
  platform?: string | boolean
  source?: string | boolean
  activity?: FiltersActivity | boolean
  keyword?: string | boolean
  ticker?: string | boolean
  limitWeb2?: number
  limitWeb3?: number
}

export interface FeedFiltersStep {
  limitWeb2: number
  limitWeb3: number
}

export type PostId = string | number | null | undefined
export type PostUrl = string |  null | undefined
export type PostSignature = string |  null | undefined
export type PostAction = Web3MessageAction | null | undefined

export interface Post {
  // web2 & web3
  // Each post might have different IDs on different servers
  id?: PostId

  // web2 only
  // guid, source, author, url, description, pubdate
  // are usually taken from the RSS feed.
  guid?: string | null
  source?: string | null
  author?: string | null
  url?: PostUrl
  description?: string | null
  pubdate?: string | null

  // web3 only
  target?: string | null
  action?: PostAction
  text?: string | null
  signer?: string | null
  signed_message?: string | null
  signature?: PostSignature
  signed_time?: string | null
  added_time?: string | null
  ipfs? : string | null

  // web2 & web3
  tickers?: string[] | string | null
  title?: string | null
  category?: string | null
  tags?: string[] | null
  upvote?: number | null
  downvote?: number | null
  bullish?: number | null
  bearish?: number | null
  important?: number | null
  scam?: number | null
  comments_count?: number | null
  latest_action_added_time?: string | null

  // comments
  children?: Post[]
}

export type Web3MessageAction = "post" | "react" | "reply" | "moderate"

export type Web3MessageLicense = "MIT" | "CC0" | "CC0-1.0" | "SPDX-License-Identifier: CC0-1.0" | "SPDX-License-Identifier: MIT"

export interface Web3Message {
  version?: string
  time?: string
  action?: Web3MessageAction
  target?: string
  title?: string 
  text?: string
  license: Web3MessageLicense
}

type SpasmVersionTag = ["spasm_version", string]

type SpasmTargetTag = ["spasm_target", string]

type SpasmActionTag = ["spasm_action", Web3MessageAction]

type SpasmCategoryTag = ["spasm_category", FiltersCategory]

type SpasmTitleTag = ["spasm_title", string]

type SpasmLicenseTag = ["license", Web3MessageLicense]

// type OtherTag = any[]

type AnyTag = any[]

export interface NostrEvent {
  id?: string,
  content: string,
  created_at: number,
  kind: number,
  pubkey: string,
  sig?: string,
  tags?: (SpasmTargetTag | SpasmActionTag | SpasmCategoryTag | SpasmTitleTag | SpasmLicenseTag | AnyTag)[],
}

export interface NostrEventUnsigned {
  id?: string
  content: string
  created_at: number
  kind: number
  pubkey: string
  tags?: AnyTag[]
}

export interface NostrEventSignedOpened extends NostrEvent {
  id: string
  sig: string
}

export type DataToExtractFromNostrEventKind0 = "username" | "about" | "website" | "picture"

export type DataToExtractFromNostrEventKind10002 = "relays" | "preferredRelays" | "preferred-relays"

export type DataToExtractFromNostrEvent = DataToExtractFromNostrEventKind0 | DataToExtractFromNostrEventKind10002

// For communication with Nostr relays
export class ProfileEthereum {
  // TODO EnsEvent
  ens: any[];

  constructor() {
    this.ens = []
  }
}

export class ProfileNostr {
  events: {
    kind: Record<NostrEventKind, NostrEventSignedOpened[]>,
  };
  relays: {
    checkedRelays: {
      checkedForEventsOfKind: Record<NostrEventKind, string[]>,
      hasEventsOfKind: Record<NostrEventKind, string[]>,
    }
  };

  constructor() {
    this.events = {
      kind: {
        any: [],
        0: [],
        10002: [],
        1: []
      }
    };
    this.relays = {
      checkedRelays: {
        checkedForEventsOfKind: {
          any: [],
          0: [],
          10002: [],
          1: []
        },
        hasEventsOfKind: {
          any: [],
          0: [],
          10002: [],
          1: []
        },
      }
    };
  }
}

export class ProfileSpasm {
  id: string;
  ethereum: ProfileEthereum;
  nostr: ProfileNostr;

  constructor(id?: string) {
    this.id = id || "";
    this.ethereum = new ProfileEthereum();
    this.nostr = new ProfileNostr();
  }
}

export type NostrEventKind = 0 | 10002 | 1 | "any"

