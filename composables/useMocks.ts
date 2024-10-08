import {Post, SpasmEventV2} from "@/helpers/interfaces"
import { spasm } from 'spasm.js'
import { useUtils } from './useUtils';
import { useEventsData } from './useEventsData';
const { validDmpEvent } = useEventsData()
const { toBeTimestamp } = useUtils()

export const useMocks = () => {
  const getDmpPosts = (): Post[] => {
    const dmpPosts: Post[] = [
      {
        "id": 101,
        "target": "",
        "action": "post",
        "title": "genesis",
        "text": "not your keys, not your words",
        "signer": "0xf8553015220a857eda377a1e903c9e5afb3ac2fa",
        "signed_message": "{\"version\":\"dmp_v0.0.1\",\"time\":\"2022-01-01T22:04:46.178Z\",\"action\":\"post\",\"target\":\"\",\"title\":\"genesis\",\"text\":\"not your keys, not your words\",\"license\":\"MIT\"}",
        "signature": "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
        "signed_time": "2022-01-01T22:04:46.178Z",
        "added_time": "2022-01-11T22:04:47.953Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": 14,
        "downvote": null,
        "bullish": 26,
        "bearish": null,
        "important": 11,
        "scam": null,
        "comments_count": 2,
        "latest_action_added_time": "2024-02-12T03:57:46.087Z"
      },
      {
        "id": 102,
        "target": "",
        "action": "post",
        "title": "The first DeFi/NFT-focused instance of the Degen Messaging Network is live",
        "text": "More than a decade has passed since the creation of decentralized censorship-resistant digital money, but even the most cutting-edge DeFi projects still rely on heavily centralized means of communication with wide-spread censorship.\n\nAt the time of writing, various projects such as Snapshot.page and Mirror.xyz allow users to interact with content and create new content using only a web3 authenticator, but they aren't trying to create a censorship-resistant network.\n\nThe Degen Messaging Network is one of the projects that try to bridge web2 with web3 and create a decentralized network for distribution of information. \n\nDegenRocket.space - the first instance of the Degen Messaging Network - is a DeFi/NFT-focused news aggregator that fetches web2 posts from the RSS feed, and all interactions with the content such as comments and reactions have to be signed with web3 authenticators.\n\nAt the moment, the first instance of the network has only a basic functionality with plans to expand web2 and web3 features and eventually open source the code so other people can run instances that will form a censorship-resistant network.\n\nAdmins will not be able to confiscate user accounts, but gatekeepers/moderators of instances will have control over certain pipes through which information is distributed. Such an architecture will allow the creation of various communities with different levels of moderation from very 'safe environments' to completely unmoderated 'free for all' playgrounds. More on that in later posts.",
        "signer": "0xf8553015220a857eda377a1e903c9e5afb3ac2fa",
        "signed_message": "{\"version\":\"dmp_v0.1.0\",\"time\":\"2022-01-22T00:00:01.185Z\",\"action\":\"post\",\"target\":\"\",\"title\":\"The first DeFi/NFT-focused instance of the Degen Messaging Network is live\",\"text\":\"More than a decade has passed since the creation of decentralized censorship-resistant digital money, but even the most cutting-edge DeFi projects still rely on heavily centralized means of communication with wide-spread censorship.\\n\\nAt the time of writing, various projects such as Snapshot.page and Mirror.xyz allow users to interact with content and create new content using only a web3 authenticator, but they aren't trying to create a censorship-resistant network.\\n\\nThe Degen Messaging Network is one of the projects that try to bridge web2 with web3 and create a decentralized network for distribution of information. \\n\\nDegenRocket.space - the first instance of the Degen Messaging Network - is a DeFi/NFT-focused news aggregator that fetches web2 posts from the RSS feed, and all interactions with the content such as comments and reactions have to be signed with web3 authenticators.\\n\\nAt the moment, the first instance of the network has only a basic functionality with plans to expand web2 and web3 features and eventually open source the code so other people can run instances that will form a censorship-resistant network.\\n\\nAdmins will not be able to confiscate user accounts, but gatekeepers/moderators of instances will have control over certain pipes through which information is distributed. Such an architecture will allow the creation of various communities with different levels of moderation from very 'safe environments' to completely unmoderated 'free for all' playgrounds. More on that in later posts.\",\"license\":\"MIT\"}",
        "signature": "0x73d634bb88a9d14fe486b9cdd4c61d1f11bb0a1b200453daf912eff99144ad635b5c4fd25cb06ce24b61594cee90a50c2c46496665a66b8630befd660831560d1b",
        "signed_time": "2022-01-22T00:00:01.185Z",
        "added_time": "2022-01-22T00:00:02.952Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": null,
        "downvote": null,
        "bullish": null,
        "bearish": null,
        "important": null,
        "scam": null,
        "comments_count": null,
        "latest_action_added_time": null
      },
      {
        "id": 103,
        "target": "",
        "action": "post",
        "title": "Hacker in the basement!",
        "text": "Testing this crazy app...",
        "signer": "0xbb5eb03535fa2bcfe9fe3bbb0f9cc48385818d92",
        "signed_message": "{\"version\":\"dmp_v0.1.0\",\"time\":\"2022-10-13T02:58:06.471Z\",\"action\":\"post\",\"target\":\"\",\"title\":\"Hacker in the basement!\",\"text\":\"Testing this crazy app...\",\"license\":\"MIT\"}",
        "signature": "0x53091ac448ff482682f415201bc720cbbb5b16c7df4b2f3ca4d06cfc6485767d1d9bff6182b12ec4ef469190b8c44556517b6ffd8ba951ddfcd6104f047c40a21b",
        "signed_time": "2022-10-13T02:58:06.471Z",
        "added_time": "2022-10-13T02:58:08.951Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": null,
        "downvote": null,
        "bullish": null,
        "bearish": null,
        "important": null,
        "scam": null,
        "comments_count": null,
        "latest_action_added_time": null
      },
      {
        "id": 104,
        "target": "",
        "action": "post",
        "title": "Universal messaging format for web3 communication tools",
        "text": "Since we don't have to solve the double-spending problem when developing decentralized social media platforms and messaging apps, it makes sense to discuss a universal messaging format for public and private web3 communication tools so signed and verifiable messages can be exchanged between different off-chain networks and blockchains. That's how we achieve real censorship resistance. #zkitter #degenrocket #status #session #lens #dm3",
        "signer": "0xf8553015220a857eda377a1e903c9e5afb3ac2fa",
        "signed_message": "{\"version\":\"dmp_v0.1.0\",\"time\":\"2022-10-14T18:16:41.572Z\",\"action\":\"post\",\"target\":\"\",\"title\":\"Universal messaging format for web3 communication tools\",\"text\":\"Since we don't have to solve the double-spending problem when developing decentralized social media platforms and messaging apps, it makes sense to discuss a universal messaging format for public and private web3 communication tools so signed and verifiable messages can be exchanged between different off-chain networks and blockchains. That's how we achieve real censorship resistance. #zkitter #degenrocket #status #session #lens #dm3\",\"license\":\"MIT\"}",
        "signature": "0x72d862977f1e8653ccf90fa4766ab8830d3d9e65643800d76183debed146ca0f2df6a53cdb7e5ada63529b41c3c7a912567592a70d41964c17d6f01435ce04951c",
        "signed_time": "2022-10-14T18:16:41.572Z",
        "added_time": "2022-10-14T18:16:42.949Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": null,
        "downvote": null,
        "bullish": null,
        "bearish": null,
        "important": null,
        "scam": null,
        "comments_count": null,
        "latest_action_added_time": null
      },
      {
        "id": 105,
        "target": "",
        "action": "post",
        "title": "Why Telegram Sucks",
        "text": "https://iframe.mediadelivery.net/embed/144738/b0f49a11-d2dc-4027-942c-84b345c1ef0b",
        "signer": "0x094a1ef2f50f36956a90e410ffc143362340865c",
        "signed_message": "{\"version\":\"dmp_v0.1.0\",\"time\":\"2023-09-27T14:35:20.364Z\",\"action\":\"post\",\"target\":\"\",\"title\":\"Why Telegram Sucks\",\"text\":\"https://iframe.mediadelivery.net/embed/144738/b0f49a11-d2dc-4027-942c-84b345c1ef0b\",\"license\":\"MIT\"}",
        "signature": "0xe87c71d85f52cc3792352ac379aa322612be1620acb4f3f0aea36c729842c3e43112cd551319a9c3e7287f56bbf35c2814abfeace1a071ad214d6dcac15410171c",
        "signed_time": "2023-09-27T14:35:20.364Z",
        "added_time": "2023-09-27T14:35:21.064Z",
        "category": "privacy",
        "tags": null,
        "tickers": null,
        "upvote": null,
        "downvote": null,
        "bullish": null,
        "bearish": null,
        "important": 3,
        "scam": 5,
        "comments_count": null,
        "latest_action_added_time": null
      },
      {
        "id": 106,
        "target": "",
        "action": "post",
        "title": "XMPP vs Matrix: Why Matrix sucks",
        "text": "https://iframe.mediadelivery.net/embed/144738/7572a121-4fc3-4a6c-8d5f-dbfac37442cd\n\nXMPP and Matrix are two competing federated end-to-end encrypted messengers.  XMPP is far better, on server cost decentralization, speed over Tor, degoogled push notifications, multi-identities, and overall privacy.  So if Matrix is inferior centralized bloatware, why is it more popular?  Especially among techies, who should in theory understand these concepts.\n\nThis brand new video gives a quick overview of the technical reasons that XMPP is the gold standard king of federation.  And it briefly discusses how Matrix manages to push it’s agenda.\n\nSome critics will say that “Matrix is a complete package, while XMPP is fragmented”.  This is essentially propaganda, because all the XMPP clients interact (Dino, Gajim, conversations, monocles).  The only one that doesn’t interact is OTR encryption from pidgin which provides an alternative for hardcore cypherpunks who want to destroy the encryption keys when the conversation is done.  So because one single client has an alternative use case, the Matrix cheerleaders want us to fill out Google Captcha spyware to register on Matrix.org because it costs so much to self-host.",
        "signer": "0x094a1ef2f50f36956a90e410ffc143362340865c",
        "signed_message": "{\"version\":\"dmp_v0.1.0\",\"time\":\"2023-09-27T14:40:17.617Z\",\"action\":\"post\",\"target\":\"\",\"title\":\"XMPP vs Matrix: Why Matrix sucks\",\"text\":\"https://iframe.mediadelivery.net/embed/144738/7572a121-4fc3-4a6c-8d5f-dbfac37442cd\\n\\nXMPP and Matrix are two competing federated end-to-end encrypted messengers.  XMPP is far better, on server cost decentralization, speed over Tor, degoogled push notifications, multi-identities, and overall privacy.  So if Matrix is inferior centralized bloatware, why is it more popular?  Especially among techies, who should in theory understand these concepts.\\n\\nThis brand new video gives a quick overview of the technical reasons that XMPP is the gold standard king of federation.  And it briefly discusses how Matrix manages to push it’s agenda.\\n\\nSome critics will say that “Matrix is a complete package, while XMPP is fragmented”.  This is essentially propaganda, because all the XMPP clients interact (Dino, Gajim, conversations, monocles).  The only one that doesn’t interact is OTR encryption from pidgin which provides an alternative for hardcore cypherpunks who want to destroy the encryption keys when the conversation is done.  So because one single client has an alternative use case, the Matrix cheerleaders want us to fill out Google Captcha spyware to register on Matrix.org because it costs so much to self-host.\",\"license\":\"MIT\"}",
        "signature": "0x13260acf8e9fe3d2b3b0b615ac9ed6e0134bc1fd1d7f97daee3e826fe81918461e61f9b272a0c125740e8d3cb1634403022516bff8122ac17dc80c36edfb12611b",
        "signed_time": "2023-09-27T14:40:17.617Z",
        "added_time": "2023-09-27T14:40:18.055Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": null,
        "downvote": null,
        "bullish": null,
        "bearish": null,
        "important": null,
        "scam": null,
        "comments_count": 1,
        "latest_action_added_time": null
      }
    ]
    return dmpPosts
  }

  const getSpasmEvents = (): SpasmEventV2[] => {
    const spasmEvents: SpasmEventV2[] = [
      {
        type: "SpasmEventV2",
        action: "post",
        title: "genesis",
        content: "not your keys, not your words",
        timestamp: 1641074686178,
        authors: [
          {
            addresses: [
              {
                value: "0xf8553015220a857eda377a1e903c9e5afb3ac2fa",
                format: { name: "ethereum-pubkey" },
                verified: true
              }
            ]
          }
        ],
        license: "MIT",
        ids: [
          {
            value: "spasmid01192d1f9994bf436f50841459d0a43c0de13ef4aaa5233827bdfe2ea2bc030d6f",
            format: {
              name: "spasmid",
              version: "01"
            }
          },
          {
            value: "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
            format: { name: "ethereum-sig", }
          }
        ],
        signatures: [
          {
            value: "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
            pubkey: "0xf8553015220a857eda377a1e903c9e5afb3ac2fa",
            format: { name: "ethereum-sig" }
          }
        ],
        siblings: [
          {
            type: "SiblingDmpSignedV2",
            protocol: {
              name: "dmp",
              version: "0.0.1"
            },
            signedString: JSON.stringify(validDmpEvent),
            ids: [
              {
                value: "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
                format: { name: "ethereum-sig" }
              }
            ],
            signatures: [
              {
                value: "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
                pubkey: "0xf8553015220a857eda377a1e903c9e5afb3ac2fa",
                format: { name: "ethereum-sig" }
              }
            ]
          }
        ]
      },
      {
        type: "SpasmEventV2",
        parent: {
          ids: [
            {
              value: "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
              format: {
                name: "ethereum-sig",
              }
            }
          ]
        },
        db: {
          key: 401,
          addedTimestamp: toBeTimestamp("2024-02-17T05:48:00.076Z")
        },
        action: "reply",
        content: "To the moon!",
        timestamp: toBeTimestamp("2024-02-17T05:47:59.932Z"),
        authors: [
          {
            addresses: [
              {
                value: "0x49e8d02294e721ac47f6f4794625312b9005fd80",
                format: { name: "ethereum-pubkey" },
                verified: true
              }
            ]
          }
        ],
        license: "SPDX-License-Identifier: CC0-1.0",
        ids: [
          {
            value: "spasmid01ea26607382b0abc560b8d7b372b7f8b7df29afc6a81ce84d9085a6ba533227a9",
            format: {
              name: "spasmid",
              version: "01"
            }
          },
          {
            value: "0xbe8bcd4b5565f146a3a069504c3efd9405fa19a9f7621dfa405f25cfeea9513072230b8533d7044efe0cd82e3af2e2f38292200006cf2103da193efcd888efc01b",
            format: {
              name: "ethereum-sig",
            }
          },
        ],
        signatures: [
          {
            value: "0xbe8bcd4b5565f146a3a069504c3efd9405fa19a9f7621dfa405f25cfeea9513072230b8533d7044efe0cd82e3af2e2f38292200006cf2103da193efcd888efc01b",
            pubkey: "0x49e8d02294e721ac47f6f4794625312b9005fd80",
            format: { name: "ethereum-sig" }
          }
        ],
        siblings: [
          {
            type: "SiblingDmpSignedV2",
            protocol: {
              name: "dmp",
              version: "0.1.0"
            },
            signedString: "{\"version\":\"dmp_v0.1.0\",\"time\":\"2024-02-17T05:47:59.932Z\",\"action\":\"reply\",\"target\":\"0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b\",\"title\":\"\",\"text\":\"To the moon!\",\"license\":\"SPDX-License-Identifier: CC0-1.0\"}",
            ids: [
              {
                value: "0xbe8bcd4b5565f146a3a069504c3efd9405fa19a9f7621dfa405f25cfeea9513072230b8533d7044efe0cd82e3af2e2f38292200006cf2103da193efcd888efc01b",
                format: {
                  name: "ethereum-sig",
                }
              }
            ],
            signatures: [
              {
                value: "0xbe8bcd4b5565f146a3a069504c3efd9405fa19a9f7621dfa405f25cfeea9513072230b8533d7044efe0cd82e3af2e2f38292200006cf2103da193efcd888efc01b",
                pubkey: "0x49e8d02294e721ac47f6f4794625312b9005fd80",
                format: { name: "ethereum-sig" }
              }
            ]
          }
        ]
      },
      {
        type: "SpasmEventV2",
        parent: {
          ids: [
            {
              value: "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
              format: {
                name: "ethereum-sig"
              }
            }
          ]
        },
        db: {
          key: 5,
          addedTimestamp: 1705545460712
        },
        action: "reply",
        content: "To the SPASM!",
        timestamp: 1708153412,
        authors: [
          {
            addresses: [
              {
                value: "2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42",
                format: {
                  name: "nostr-hex",
                },
                verified: true
              }
            ]
          }
        ],
        license: "SPDX-License-Identifier: CC0-1.0",
        ids: [
          {
            value: "spasmid01906605460f67979a0f82eb220e58ba1de54aadebab4ed601c41ea695d51be1f0",
            format: {
              name: "spasmid",
              version: "01"
            }
          },
          {
            value: "4ca9b330abad821509acbfe90ebcc25f267e02718377eb4d831bc5bb9482c85f",
            format: {
              name: "nostr-hex",
            }
          },
          {
            value: "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
            format: {
              name: "nostr-sig",
            }
          }
        ],
        signatures: [
          {
            value: "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
            pubkey: "2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42",
            format: { name: "nostr-sig" }
          }
        ],
        siblings: [
          {
            type: "SiblingNostrSpasmSignedV2",
            protocol: {
              name: "nostr",
              hasExtraSpasmFields: true,
              extraSpasmFieldsVersion: "1.0.0"
            },
            originalObject: {
                kind: 1,
                created_at: 1708153412,
                tags: [
                  ["license","SPDX-License-Identifier: CC0-1.0"],
                  ["spasm_version","1.0.0"],
                  ["spasm_action","reply"],
                  ["spasm_target","0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b"]
                ],
                content: "To the SPASM!",
                pubkey:"2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42",
                id:"4ca9b330abad821509acbfe90ebcc25f267e02718377eb4d831bc5bb9482c85f",
                sig:"2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290"
            },
            ids: [
              {
                value: "4ca9b330abad821509acbfe90ebcc25f267e02718377eb4d831bc5bb9482c85f",
                format: {
                  name: "nostr-hex",
                }
              },
              {
                value: "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
                format: {
                  name: "nostr-sig",
                }
              }
            ],
            signatures: [
              {
                value: "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
                pubkey: "2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42",
                format: { name: "nostr-sig" }
              }
            ],
          }
        ],
        stats: [
          {
            action: "react",
            contents: [
              {
                value: "upvote",
                total: 11
              },
              {
                value: "downvote",
                total: 1
              },
              {
                value: "bullish",
                total: 2
              },
              {
                value: "bearish",
                total: 3
              },
              {
                value: "important",
                total: 6
              },
              {
                value: "scam",
                total: 3
              },
            ]
          },
          {
            action: "reply",
            total: 3
          }
        ]
      }
    ]
    return spasmEvents
  }

  const getRssPosts = (): Post[] => {
    const rssPosts: Post[] = [
      {
        "id": 201,
        "guid": "https://dark.fi/insights/testnet-v1a.html",
        "source": "darkfi-blog",
        "tickers": "DRK",
        "title": "DarkFi Testnet v0.1 alpha",
        "url": "https://dark.fi/insights/testnet-v1a.html",
        "description": "DarkFi is now on testnet....",
        "pubdate": "2023-02-03T12:00:00.000Z",
        "category": "defi",
        "tags": null,
        "upvote": 2,
        "downvote": null,
        "bullish": 5,
        "bearish": null,
        "important": null,
        "scam": null,
        "comments_count": null,
        "latest_action_added_time": "2023-05-03T23:23:44.637Z"
      }
    ]
    return rssPosts
  }

  const getNostrPosts = (): Post[] => {
    const nostrPosts: Post[] = [
      {
        "id": 301,
        "target": "",
        "action": "post",
        "title": "Session Bot? Game Changer for Free Speech",
        "text": "https://iframe.mediadelivery.net/embed/144738/fa94362b-1ad0-4545-881e-13eb49a41f85",
        "signer": "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6",
        "signed_message": "{\"kind\":1,\"created_at\":1702700629,\"tags\":[[\"license\",\"SPDX-License-Identifier: CC0-1.0\"],[\"spasm_version\",\"1.0.0\"],[\"spasm_action\",\"post\"],[\"spasm_title\",\"Session Bot? Game Changer for Free Speech\"]],\"content\":\"https://iframe.mediadelivery.net/embed/144738/fa94362b-1ad0-4545-881e-13eb49a41f85\",\"pubkey\":\"ac3f6afe17593f61810513dac9a1e544e87b9ce91b27d37b88ec58fbaa9014aa\",\"id\":\"6605eaa3bc42964ef44fb2ce8e47383756f45d69990f267cd3425586d33d36d8\",\"sig\":\"a4338bb9e1eef8b14b2a76e053b11b7b01fb0cb4b8405c503acf20734c8b6013d80754d829120a8a045b109f36935babb3960f93acc3237b8efc67994bfbb74b\"}",
        "signature": "a4338bb9e1eef8b14b2a76e053b11b7b01fb0cb4b8405c503acf20734c8b6013d80754d829120a8a045b109f36935babb3960f93acc3237b8efc67994bfbb74b",
        "signed_time": "2023-12-16T04:23:49.000Z",
        "added_time": "2023-12-16T04:23:50.377Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": 1,
        "downvote": 1,
        "bullish": 1,
        "bearish": 1,
        "important": 1,
        "scam": 1,
        "comments_count": null,
        "latest_action_added_time": null
      }
    ]
    return nostrPosts
  }

  const getSpasmEventComments = (): SpasmEventV2[] => {
    const spasmEventComments: SpasmEventV2[] = [
      {
        type: "SpasmEventV2",
        parent: {
          ids: [
            {
              value: "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
              format: {
                name: "ethereum-sig"
              }
            }
          ]
        },
        db: {
          key: 5,
          addedTimestamp: 1705545460712
        },
        action: "reply",
        content: "To the SPASM!",
        timestamp: 1708153412,
        authors: [
          {
            addresses: [
              {
                value: "2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42",
                format: {
                  name: "nostr-hex",
                },
                verified: true
              }
            ]
          }
        ],
        license: "SPDX-License-Identifier: CC0-1.0",
        ids: [
          {
            value: "spasmid01906605460f67979a0f82eb220e58ba1de54aadebab4ed601c41ea695d51be1f0",
            format: {
              name: "spasmid",
              version: "01"
            }
          },
          {
            value: "4ca9b330abad821509acbfe90ebcc25f267e02718377eb4d831bc5bb9482c85f",
            format: {
              name: "nostr-hex",
            }
          },
          {
            value: "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
            format: {
              name: "nostr-sig",
            }
          }
        ],
        signatures: [
          {
            value: "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
            pubkey: "2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42",
            format: { name: "nostr-sig" }
          }
        ],
        siblings: [
          {
            type: "SiblingNostrSpasmSignedV2",
            protocol: {
              name: "nostr",
              hasExtraSpasmFields: true,
              extraSpasmFieldsVersion: "1.0.0"
            },
            originalObject: {
                kind: 1,
                created_at: 1708153412,
                tags: [
                  ["license","SPDX-License-Identifier: CC0-1.0"],
                  ["spasm_version","1.0.0"],
                  ["spasm_action","reply"],
                  ["spasm_target","0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b"]
                ],
                content: "To the SPASM!",
                pubkey:"2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42",
                id:"4ca9b330abad821509acbfe90ebcc25f267e02718377eb4d831bc5bb9482c85f",
                sig:"2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290"
            },
            ids: [
              {
                value: "4ca9b330abad821509acbfe90ebcc25f267e02718377eb4d831bc5bb9482c85f",
                format: {
                  name: "nostr-hex",
                }
              },
              {
                value: "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
                format: {
                  name: "nostr-sig",
                }
              }
            ],
            signatures: [
              {
                value: "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
                pubkey: "2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42",
                format: { name: "nostr-sig" }
              }
            ],
          }
        ],
        stats: [
          {
            action: "react",
            contents: [
              {
                value: "upvote",
                total: 11
              },
              {
                value: "downvote",
                total: 1
              },
              {
                value: "bullish",
                total: 2
              },
              {
                value: "bearish",
                total: 3
              },
              {
                value: "important",
                total: 6
              },
              {
                value: "scam",
                total: 3
              },
            ]
          },
          {
            action: "reply",
            total: 3
          }
        ]
      }
    ]
    return spasmEventComments
  }

  const getDmpComments = (): Post[] => {
    const dmpComments: Post[] = [
      {
        "id": 401,
        "target": "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
        "action": "reply",
        "title": "",
        "text": "To the moon!",
        "signer": "0x49e8d02294e721ac47f6f4794625312b9005fd80",
        "signed_message": "{\"version\":\"dmp_v0.1.0\",\"time\":\"2024-02-17T05:47:59.932Z\",\"action\":\"reply\",\"target\":\"0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b\",\"title\":\"\",\"text\":\"To the moon!\",\"license\":\"SPDX-License-Identifier: CC0-1.0\"}",
        "signature": "0xbe8bcd4b5565f146a3a069504c3efd9405fa19a9f7621dfa405f25cfeea9513072230b8533d7044efe0cd82e3af2e2f38292200006cf2103da193efcd888efc01b",
        "signed_time": "2024-02-17T05:47:59.932Z",
        "added_time": "2024-02-17T05:48:00.076Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": null,
        "downvote": null,
        "bullish": null,
        "bearish": null,
        "important": null,
        "scam": null,
        "comments_count": null,
        "latest_action_added_time": null
      },
      {
        "id": 404,
        "target": "0x13260acf8e9fe3d2b3b0b615ac9ed6e0134bc1fd1d7f97daee3e826fe81918461e61f9b272a0c125740e8d3cb1634403022516bff8122ac17dc80c36edfb12611b",
        "action": "reply",
        "title": "",
        "text": "XMPooP",
        "signer": "0x49e8d02294e721ac47f6f4794625312b9005fd80",
        "signed_message": "{\"version\":\"dmp_v0.1.0\",\"time\":\"2024-02-17T05:49:14.544Z\",\"action\":\"reply\",\"target\":\"0x13260acf8e9fe3d2b3b0b615ac9ed6e0134bc1fd1d7f97daee3e826fe81918461e61f9b272a0c125740e8d3cb1634403022516bff8122ac17dc80c36edfb12611b\",\"title\":\"\",\"text\":\"XMPooP\",\"license\":\"SPDX-License-Identifier: CC0-1.0\"}",
        "signature": "0x1d4364c93b9beb264caf83e3bc175bde38623bc91029d43a322308ed9dedd0596e992f57a639a618a020e6af5c9e40560264c4b5b927678b68bfad9e3566af121c",
        "signed_time": "2024-02-17T05:49:14.544Z",
        "added_time": "2024-02-17T05:49:14.590Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": null,
        "downvote": null,
        "bullish": null,
        "bearish": null,
        "important": null,
        "scam": null,
        "comments_count": null,
        "latest_action_added_time": null
      }
    ]
    return dmpComments
  }

  const getNostrComments = (): Post[] => {
    const dmpComments: Post[] = [
      {
        "id": 501,
        "target": "0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b",
        "action": "reply",
        "title": "",
        "text": "To the SPASM!",
        "signer": "npub195ke7xdf3efncf6spe0s26322mdcl6frj0n6yy6akcadxqzgdapqjsm60y",
        "signed_message": "{\"kind\":1,\"created_at\":1708153412,\"tags\":[[\"license\",\"SPDX-License-Identifier: CC0-1.0\"],[\"spasm_version\",\"1.0.0\"],[\"spasm_action\",\"reply\"],[\"spasm_target\",\"0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b\"]],\"content\":\"To the SPASM!\",\"pubkey\":\"2d2d9f19a98e533c27500e5f056a2a56db8fe92393e7a2135db63ad300486f42\",\"id\":\"4ca9b330abad821509acbfe90ebcc25f267e02718377eb4d831bc5bb9482c85f\",\"sig\":\"2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290\"}",
        "signature": "2f8f195c70070f0c434c397da2fb44b1196994a2f24515d76477a8c8b5a4f289fcc5287d8163cbadfee29af55450fa9fa6b15ac732877d732e98e2be10acb290",
        "signed_time": "2024-02-17T07:03:32.000Z",
        "added_time": "2024-02-17T07:03:34.842Z",
        "category": null,
        "tags": null,
        "tickers": null,
        "upvote": null,
        "downvote": null,
        "bullish": null,
        "bearish": null,
        "important": null,
        "scam": null,
        "comments_count": null,
        "latest_action_added_time": null
      }
    ]
    return dmpComments
  }

  const getMockPosts = (): Post[] => {
    let mockPosts: Post[] = []
      // const {apiURL} = useRuntimeConfig()?.public
    mockPosts = mockPosts.concat(getDmpPosts())
    mockPosts = mockPosts.concat(getRssPosts())
    mockPosts = mockPosts.concat(getNostrPosts())
    return mockPosts
  }

  const getMockEvents = (): SpasmEventV2[] => {
    let mockEvents: SpasmEventV2[] = []
      // const {apiURL} = useRuntimeConfig()?.public
    mockEvents = mockEvents.concat(getSpasmEvents())
    // mockEvents = mockEvents.concat(getRssPosts())
    // mockEvents = mockEvents.concat(getNostrPosts())
    return mockEvents
  }

  const getMockPostsByAddress = (address: string): Post[] => {
    const mockPosts = getMockPostsAndComments()
    return mockPosts.filter(
      post => post.signer === address
    )
  }

  const getMockEventsByAddress = (
    address: string
  ): SpasmEventV2[] => {
    const allMockSpasmEvents = getMockEvents()
    const filteredMockSpasmEvents: SpasmEventV2[] = []
    if (
      allMockSpasmEvents &&
      Array.isArray(allMockSpasmEvents)
    ) {
      allMockSpasmEvents.forEach(event => {
        if (spasm.isAnySignerListedIn(event, [address])) {
          filteredMockSpasmEvents.push(event)
        }
      })
    }
    return filteredMockSpasmEvents
  }

  const getMockPostById = (sigUrlIpfs: string): Post[] => {
    const mockPosts = getMockPostsAndComments()
    return mockPosts.filter(
      post => post.signature?.startsWith(sigUrlIpfs)
    )
  }

  const getMockComments = (): Post[] => {
    let mockComments: Post[] = []
    mockComments = mockComments.concat(getDmpComments())
    mockComments = mockComments.concat(getNostrComments())
    return mockComments
  }

  const getMockCommentsById = (sigUrlIpfs: string): Post[] => {
    const mockComments = getMockComments()
    return mockComments.filter(
      comment => comment.target?.startsWith(sigUrlIpfs)
    )
  }

  const getMockPostsAndComments = (): Post[] => {
    const mockPosts = getMockPosts()
    const mockComments = getMockComments()
    const mockPostsAndComments = mockPosts.concat(mockComments)
    return mockPostsAndComments
  }

  const getMockSpasmEventComments = (): SpasmEventV2[] => {
    let mockSpasmEventComments: SpasmEventV2[] = []
    mockSpasmEventComments =
      mockSpasmEventComments.concat(getSpasmEventComments())

    let mockCommentsV1: SpasmEventV2[] | null =
      spasm.convertManyToSpasm(getMockComments())
    if (mockCommentsV1) {
      mockSpasmEventComments =
        mockSpasmEventComments.concat(mockCommentsV1)
    }

    return mockSpasmEventComments
  }

  return {
    getDmpPosts,
    getRssPosts,
    getNostrPosts,
    getMockPosts,
    getMockPostsByAddress,
    getMockPostById,
    getDmpComments,
    getMockComments,
    getMockEventsByAddress,
    getMockCommentsById,
    getMockPostsAndComments,
    // V2
    getMockEvents,
    getMockSpasmEventComments,
  }
}
