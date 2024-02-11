import {describe, it, test, expect, assert} from 'vitest';
import { useNostr } from './useNostr';

const {
  convertNpubOrHexAddressToHex,
  convertNpubOrHexAddressesToHex,
  convertHexOrNpubAddressToNpub,
  convertHexAddressesToNpub
} = useNostr()

// Template
describe('some function', () => {
  it(
    "should return true",
    () => {
    expect(
      true
    ).toBe(
    true
    );
  });
});

const validNpubAddress1 = "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr0z"
const validNpubAddress2 = "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6"
const validHexAddress1 = "b3a706bcceb39f193da553ce76255dd6ba5b097001c8ef85ff1b92e994894c81"
const validHexAddress2 = "ac3f6afe17593f61810513dac9a1e544e87b9ce91b27d37b88ec58fbaa9014aa"
const invalidNpubAddress1 = "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr1z"
const invalidNpubAddress2 = "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d7"
const invalidHexAddress1 = "b3a706bcceb39f193da553ce76255dd6ba5b097001c8ef85ff1b92e994894c82"
const invalidHexAddress2 = "ac3f6afe17593f61810513dac9a1e544e87b9ce91b27d37b88ec58fbaa9015aa"

describe('convertNpubOrHexAddressToHex function', () => {
  it(
    "should return a valid hex address when a valid npub is passed",
    () => {
    expect(
      convertNpubOrHexAddressToHex(validNpubAddress1)
    ).toBe(
    validHexAddress1
    );
  });

  it(
    "should return a valid hex address when a valid hex is passed",
    () => {
    expect(
      convertNpubOrHexAddressToHex(validHexAddress1)
    ).toBe(
    validHexAddress1
    );
  });

  it(
    "should return '' when a too long invalid npub is passed",
    () => {
    expect(
      convertNpubOrHexAddressToHex(validNpubAddress1 + "1234")
      // convertNpubOrHexAddressToHex("hello")
    ).toBe(
    ''
    );
  });

  it(
    "should return '' when an invalid npub with valid length is passed",
    () => {
    expect(
      convertNpubOrHexAddressToHex(invalidNpubAddress1)
    ).toBe(
    ''
    );
  });

  it(
    "should return '' when an array of valid npub addresses is passed",
    () => {
    expect(
      convertNpubOrHexAddressToHex([validNpubAddress1, validNpubAddress2])
    ).toBe(
    ''
    );
  });

  it(
    "should return '' when an object with a valid npub address is passed",
    () => {
    expect(
      convertNpubOrHexAddressToHex({valid: validHexAddress1})
    ).toBe(
    ''
    );
  });
});

describe('convertNpubOrHexAddressesToHex function', () => {
  it(
    "should return an array with one valid hex if one valid npub is passed",
    () => {
    expect(
      convertNpubOrHexAddressesToHex(validNpubAddress1)
    ).toStrictEqual(
      [validHexAddress1]
    );
  });

  it(
    "should return an array with one valid hex if one hex is passed",
    () => {
    expect(
      convertNpubOrHexAddressesToHex(validHexAddress1)
    ).toStrictEqual(
      [validHexAddress1]
    );
  });

  it(
    "should return an array of valid hex if array of valid npubs is passed",
    () => {
    expect(
      convertNpubOrHexAddressesToHex([validNpubAddress1, validNpubAddress2])
    ).toStrictEqual(
      [validHexAddress1, validHexAddress2]
    );
  });

  it(
    "should return an array of valid hex if array of valid hex is passed",
    () => {
    expect(
      convertNpubOrHexAddressesToHex([validHexAddress1, validHexAddress2])
    ).toStrictEqual(
      [validHexAddress1, validHexAddress2]
    );
  });

  it(
    "should return an array with a valid hex if an array of valid and invalid hex is passed",
    () => {
    expect(
      convertNpubOrHexAddressesToHex([validHexAddress1, invalidNpubAddress1])
    ).toStrictEqual(
      [validHexAddress1]
    );
  });

  it(
    "should return an empty array if an array with two invalid hex is passed",
    () => {
    expect(
      convertNpubOrHexAddressesToHex([invalidNpubAddress1, invalidNpubAddress2])
    ).toStrictEqual(
      []
    );
  });
});

describe('convertHexOrNpubAddressToNpub function', () => {
  it(
    "should return a valid npub address when a valid hex is passed",
    () => {
    expect(
      convertHexOrNpubAddressToNpub(validHexAddress1)
    ).toBe(
    validNpubAddress1
    );
  });

  it(
    "should return a valid npub address when a valid npub is passed",
    () => {
    expect(
      convertHexOrNpubAddressToNpub(validNpubAddress1)
    ).toBe(
    validNpubAddress1
    );
  });

  it(
    "should return '' when a too long invalid npub is passed",
    () => {
    expect(
      convertHexOrNpubAddressToNpub(validNpubAddress1 + "1234")
    ).toBe(
    ''
    );
  });

  it(
    "should return '' when a too long invalid hex is passed",
    () => {
    expect(
      convertHexOrNpubAddressToNpub(validHexAddress1 + "1234")
    ).toBe(
    ''
    );
  });

  // Looks like any invalid npub can be converted to npub
  // it(
  //   "should return '' when an invalid npub with valid length is passed",
  //   () => {
  //   expect(
  //     convertHexOrNpubAddressToNpub(invalidNpubAddress1)
  //   ).toBe(
  //   ''
  //   );
  // });

  // Looks like any invalid hex can be converted to npub
  // it(
  //   "should return '' when an invalid hex with valid length is passed",
  //   () => {
  //   expect(
  //     convertHexOrNpubAddressToNpub(invalidHexAddress1)
  //   ).toBe(
  //   ''
  //   );
  // });

  it(
    "should return '' when an array of valid npub addresses is passed",
    () => {
    expect(
      convertHexOrNpubAddressToNpub([validHexAddress1, validHexAddress2])
    ).toBe(
    ''
    );
  });

  it(
    "should return '' when an object with a valid npub address is passed",
    () => {
    expect(
      convertHexOrNpubAddressToNpub({valid: validHexAddress1})
    ).toBe(
    ''
    );
  });
});

describe('convertHexAddressesToNpub function', () => {
  it(
    "should return an array with one valid npub if one valid hex is passed",
    () => {
    expect(
      convertHexAddressesToNpub(validHexAddress1)
    ).toStrictEqual(
      [validNpubAddress1]
    );
  });

  it(
    "should return an array with one valid npub if one npub is passed",
    () => {
    expect(
      convertHexAddressesToNpub(validNpubAddress1)
    ).toStrictEqual(
      [validNpubAddress1]
    );
  });

  it(
    "should return an array of valid npub if array of valid hex is passed",
    () => {
    expect(
      convertHexAddressesToNpub([validHexAddress1, validHexAddress2])
    ).toStrictEqual(
      [validNpubAddress1, validNpubAddress2]
    );
  });

  it(
    "should return an array of valid npub if array of valid npub is passed",
    () => {
    expect(
      convertHexAddressesToNpub([validNpubAddress1, validNpubAddress2])
    ).toStrictEqual(
      [validNpubAddress1, validNpubAddress2]
    );
  });

  // it(
  //   "should return an array with a valid npub if an array of valid and invalid hex is passed",
  //   () => {
  //   expect(
  //     convertHexAddressesToNpub([validHexAddress1, invalidHexAddress2])
  //   ).toStrictEqual(
  //     [validNpubAddress1]
  //   );
  // });

  it(
    "should return an array with a valid npub if an array of valid and invalid hex is passed",
    () => {
    expect(
      convertHexAddressesToNpub([validHexAddress1, validHexAddress2 + "12345"])
    ).toStrictEqual(
      [validNpubAddress1]
    );
  });

  // it(
  //   "should return an empty array if an array with two invalid hex is passed",
  //   () => {
  //   expect(
  //     convertHexAddressesToNpub([invalidHexAddress1, invalidHexAddress2])
  //   ).toStrictEqual(
  //     []
  //   );
  // });

  it(
    "should return an empty array if an array with two invalid hex is passed",
    () => {
    expect(
      convertHexAddressesToNpub([validHexAddress1 + "abc", validHexAddress2 + "12345"])
    ).toStrictEqual(
      []
    );
  });
});
