import {
  DmpEvent,
  DmpEventSignedClosed,
  DmpEventSignedOpened,
  SpasmEventV2
} from "@/helpers/interfaces"

export const useEventsData = () => {
// ==============
// From spasm.js:
const validDmpEvent: DmpEvent = {
  version: "dmp_v0.0.1",
  time: "2022-01-01T22:04:46.178Z",
  action: "post",
  target: "",
  title: "genesis",
  text: "not your keys, not your words",
  license: "MIT"
}

const validDmpEventSignedClosed: DmpEventSignedClosed = {
  signer: '0xf8553015220a857eda377a1e903c9e5afb3ac2fa',
  signature: '0xbd934a01dc3bd9bb183bda807d35e61accf7396c527b8a3d029c20c00b294cf029997be953772da32483b077eea856e6bafcae7a2aff95ae572af25dd3e204a71b',
  // signedString: JSON.stringify(validDmpEvent)
  signedString: "{\"version\":\"dmp_v0.0.1\",\"time\":\"2022-01-01T22:04:46.178Z\",\"action\":\"post\",\"target\":\"\",\"title\":\"genesis\",\"text\":\"not your keys, not your words\",\"license\":\"MIT\"}"
}

const validDmpEventSignedOpened: DmpEventSignedOpened = {
  ...validDmpEventSignedClosed,
  signedObject: validDmpEvent
}

const validDmpEventConvertedToSpasmEventV2: SpasmEventV2 = {
  type: "SpasmEventV2",
  action: "post",
  ids: [
    {
      value: "spasmid0103086d8c9881aa566b755d0b50fc0c80ab4362224860ee21859e658f64cca4c3",
      format: {
        name: "spasmid",
        version: "01"
      }
    }
  ],
  title: "genesis",
  content: "not your keys, not your words",
  timestamp: 1641074686178,
  license: "MIT",
  siblings: [
    {
      type: "SiblingDmpV2",
      protocol: {
        name: "dmp",
        version: "0.0.1"
      },
      signedString: JSON.stringify(validDmpEvent),
    }
  ]
}

const validDmpEventSignedClosedConvertedToSpasmV2: SpasmEventV2 = {
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
}

const validDmpEventSignedOpenedConvertedToSpasmV2: SpasmEventV2 = {
  ...validDmpEventSignedClosedConvertedToSpasmV2,
}

  return {
    validDmpEvent,
    validDmpEventSignedClosed,
    validDmpEventSignedOpened,
    validDmpEventConvertedToSpasmEventV2,
    validDmpEventSignedClosedConvertedToSpasmV2,
    validDmpEventSignedOpenedConvertedToSpasmV2,
  }
}
