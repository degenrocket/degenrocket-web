import {Post, SpasmEventV2} from './../helpers/interfaces';
import {describe, it, test, expect, assert} from 'vitest';
import { useUtils } from './useUtils';

describe('runs', () => {
  test("it works", () => {
    expect(true).toBe(true);
  });
});

const { hasValue } = useUtils()

describe('hasValue function', () => {
  it('should return false for undefined, null, 0, "", false, NaN', () => {
    expect(hasValue(undefined)).toBe(false);
    expect(hasValue(null)).toBe(false);
    expect(hasValue(0)).toBe(false);
    expect(hasValue('')).toBe(false);
    expect(hasValue(false)).toBe(false);
    expect(hasValue(NaN)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(hasValue({})).toBe(false);
  });

  it('should return false for an empty array', () => {
    expect(hasValue([])).toBe(false);
  });

  it('should return true for an array with at least one value', () => {
    expect(hasValue([1])).toBe(true);
  });

  it('should return true for a non-empty object', () => {
    expect(hasValue({ a: 1 })).toBe(true);
  });

  it('should return true for a truthy value', () => {
    expect(hasValue(1)).toBe(true);
    expect(hasValue(true)).toBe(true);
  });

  it('should return false for a falsy value', () => {
    expect(hasValue(undefined)).toBe(false);
    expect(hasValue(null)).toBe(false);
    expect(hasValue(0)).toBe(false);
    expect(hasValue('')).toBe(false);
    expect(hasValue(false)).toBe(false);
    expect(hasValue(NaN)).toBe(false);
  });

  it('should return false if all elements of an arrays have no value', () => {
    expect(hasValue([[undefined], [0], [null, NaN], ''])).toBe(false);
  });

  it('should return true if at least one element of an array has value', () => {
    expect(hasValue([[undefined], [0], [null, 1], ''])).toBe(true);
  });

  it('should return true if at least one element of an array has value', () => {
    expect(hasValue([[undefined], 1, [null, NaN], ''])).toBe(true);
  });

  it('should return true if at least one element of an array has value', () => {
    expect(hasValue([[null], 0, [true, NaN]])).toBe(true);
  });

  it('should return true if at least one element of an array has value', () => {
    expect(hasValue([[null], 0, ['hello', NaN]])).toBe(true);
  });
});

const { isArrayOfStrings } = useUtils()

describe('isArrayOfStrings', () => {
  test('returns true when array has only strings', () => {
    expect(isArrayOfStrings(["abc", "def"])).toBe(true);
  });

  test('returns true when array has at least one empty string', () => {
    expect(isArrayOfStrings(["abc", ""])).toBe(true);
  });

  test('returns false when array has at least one non-string value', () => {
    expect(isArrayOfStrings(["abc", 0])).toBe(false);
    expect(isArrayOfStrings(["abc", 1])).toBe(false);
    expect(isArrayOfStrings(["abc", null])).toBe(false);
    expect(isArrayOfStrings(["abc", undefined])).toBe(false);
    expect(isArrayOfStrings(["abc", true])).toBe(false);
    expect(isArrayOfStrings(["abc", false])).toBe(false);
    expect(isArrayOfStrings(["abc", ["xyz"]])).toBe(false);
    expect(isArrayOfStrings(["abc", {str:"xyz"}])).toBe(false);
    expect(isArrayOfStrings([0, "abc"])).toBe(false);
    expect(isArrayOfStrings([1, "abc"])).toBe(false);
    expect(isArrayOfStrings([null, "abc"])).toBe(false);
    expect(isArrayOfStrings([undefined, "abc"])).toBe(false);
    expect(isArrayOfStrings([true, "abc"])).toBe(false);
    expect(isArrayOfStrings([false, "abc"])).toBe(false);
    expect(isArrayOfStrings([["xyz"], "abc"])).toBe(false);
    expect(isArrayOfStrings([{str:"xyz"}, "abc"])).toBe(false);
  });

  test('returns true when array has one empty string', () => {
    expect(isArrayOfStrings([""])).toBe(true);
  });

  test('returns false when value is an object', () => {
    expect(isArrayOfStrings({id: 1})).toBe(false);
  });

  test('returns false when value is null', () => {
    expect(isArrayOfStrings(null)).toBe(false);
  });

  test('returns false when value is undefined', () => {
    expect(isArrayOfStrings(undefined)).toBe(false);
  });

  test('returns false when value is an empty string', () => {
    expect(isArrayOfStrings('')).toBe(false);
  });

  test('returns false when value is a number', () => {
    expect(isArrayOfStrings(1)).toBe(false);
  });
})

const { isArrayOfStringsWithValues } = useUtils()

describe('isArrayOfStringsWithValues', () => {
  test('returns true when array has only strings', () => {
    expect(isArrayOfStringsWithValues(["abc", "def"])).toBe(true);
  });

  test('returns false when array has at least one empty string', () => {
    expect(isArrayOfStringsWithValues(["abc", ""])).toBe(false);
  });

  test('returns false when array has at least one non-string value', () => {
    expect(isArrayOfStringsWithValues(["abc", 1])).toBe(false);
    expect(isArrayOfStringsWithValues(["abc", 0])).toBe(false);
    expect(isArrayOfStringsWithValues(["abc", 1])).toBe(false);
    expect(isArrayOfStringsWithValues(["abc", null])).toBe(false);
    expect(isArrayOfStringsWithValues(["abc", undefined])).toBe(false);
    expect(isArrayOfStringsWithValues(["abc", true])).toBe(false);
    expect(isArrayOfStringsWithValues(["abc", false])).toBe(false);
    expect(isArrayOfStringsWithValues(["abc", ["xyz"]])).toBe(false);
    expect(isArrayOfStringsWithValues(["abc", {str:"xyz"}])).toBe(false);
    expect(isArrayOfStringsWithValues([0, "abc"])).toBe(false);
    expect(isArrayOfStringsWithValues([1, "abc"])).toBe(false);
    expect(isArrayOfStringsWithValues([null, "abc"])).toBe(false);
    expect(isArrayOfStringsWithValues([undefined, "abc"])).toBe(false);
    expect(isArrayOfStringsWithValues([true, "abc"])).toBe(false);
    expect(isArrayOfStringsWithValues([false, "abc"])).toBe(false);
    expect(isArrayOfStringsWithValues([["xyz"], "abc"])).toBe(false);
    expect(isArrayOfStringsWithValues([{str:"xyz"}, "abc"])).toBe(false);
  });

  test('returns false when array has one empty string', () => {
    expect( isArrayOfStringsWithValues([""])).toBe(false);
  });

  test('returns false when value is an object', () => {
    expect( isArrayOfStrings({id: 1})).toBe(false);
  });

  test('returns false when value is null', () => {
    expect( isArrayOfStringsWithValues(null)).toBe(false);
  });

  test('returns false when value is undefined', () => {
    expect( isArrayOfStringsWithValues(undefined)).toBe(false);
  });

  test('returns false when value is an empty string', () => {
    expect( isArrayOfStringsWithValues('')).toBe(false);
  });

  test('returns false when value is a number', () => {
    expect( isArrayOfStringsWithValues(1)).toBe(false);
  });
})

const { isValidPost } = useUtils()

describe('isValidPost', () => {
  test('returns false when post is undefined', () => {
    expect(isValidPost(undefined)).toBe(false);
  });

  test('returns false when post is an empty object', () => {
    expect(isValidPost({})).toBe(false);
  });

  test('returns false when post is an empty array', () => {
    expect(isValidPost([] as Post)).toBe(false);
  });

  test('returns false when post has no values for signature, url, or id', () => {
    expect(isValidPost({ foo: 'bar' } as Post)).toBe(false);
  });

  test('returns true when post has a signature with action "post"', () => {
    const post = { signature: 'foo', action: 'post' };
    expect(isValidPost(post as Post)).toBe(true);
  });

  test('returns false when post has a signature with an invalid action', () => {
    const post = { signature: 'foo', action: 'invalid' };
    expect(isValidPost(post as Post)).toBe(false);
  });

  test('returns true when post has a signature with action "reply" and a target', () => {
    const post = { signature: 'foo', action: 'reply', target: 'bar' };
    expect(isValidPost(post as Post)).toBe(true);
  });

  test('returns false when post has a signature with action "reply" and no target', () => {
    const post = { signature: 'foo', action: 'reply' };
    expect(isValidPost(post as Post)).toBe(false);
  });

  test('returns true when post has a signature with action "react" and a target', () => {
    const post = { signature: 'foo', action: 'react', target: 'bar' };
    expect(isValidPost(post as Post)).toBe(true);
  });

  test('returns false when post has a signature with action "react" and no target', () => {
    const post = { signature: 'foo', action: 'react' };
    expect(isValidPost(post as Post)).toBe(false);
  });

  test('returns true when post has a url', () => {
    const post = { url: 'http://example.com' };
    expect(isValidPost(post)).toBe(true);
  });

  test('returns true when post has an id', () => {
    const post = { id: '123' };
    expect(isValidPost(post)).toBe(true);
  });

  test('returns true when post has an ipfs property', () => {
    const post = { ipfs: 'Qm123' };
    expect(isValidPost(post)).toBe(true);
  });
});


const { areValidPosts } = useUtils()

describe('areValidPosts', () => {
  test('areValidPosts returns true if all posts are valid', () => {
    const validPost = {
      id: 1,
      title: "Valid Post",
      content: "This post is valid",
    };

    const validPostSig = {
      title: "Valid Post",
      signature: "0x123signature",
      action: "reply",
      target: "0x123target"
    };

    const validPosts1 = [validPost];
    const result1 = areValidPosts(validPosts1);
    expect(result1).toBe(true);

    const validPosts2 = [validPost, validPostSig as Post];
    const result2 = areValidPosts(validPosts2);
    expect(result2).toBe(true);
  });

  test('areValidPosts returns false if any post is invalid', () => {
    const validPost = {
      id: 1,
      title: "Valid Post",
      description: "This post is valid",
    };

    const invalidPostNoId = {
      title: "Invalid Post",
      description: "",
    };

    const invalidPostSigButNoAction = {
      title: "Invalid Post",
      signature: "0x123signature",
    };

    const invalidPostSigActionButNoTarget = {
      title: "Invalid Post",
      signature: "0x123signature",
      action: "reply",
    };

    const invalidPosts1 = [validPost, invalidPostNoId];
    const result1 = areValidPosts(invalidPosts1);
    expect(result1).toBe(false);

    const invalidPosts2 = [validPost, invalidPostSigButNoAction];
    const result2 = areValidPosts(invalidPosts2);
    expect(result2).toBe(false);

    const invalidPosts3 = [validPost, invalidPostSigActionButNoTarget as Post];
    const result3 = areValidPosts(invalidPosts3);
    expect(result3).toBe(false);
  });

  test('areValidPosts returns false if posts is undefined', async () => {
    const result = areValidPosts(undefined);
    expect(result).toBe(false);
  });

  test('areValidPosts returns false if posts is null', async () => {
    const result = areValidPosts(null);
    expect(result).toBe(false);
  });

  test('areValidPosts returns false if posts is not an array', async () => {
    const result = areValidPosts({} as Post[]);
    expect(result).toBe(false);
  });

  test('areValidPosts returns false if posts is an empty array', async () => {
    const result = areValidPosts([]);
    expect(result).toBe(false);
  });
})

const { isValidSpasmEventV2 } = useUtils()

describe('isValidSpasmEventV2', () => {
  test('returns false when event is undefined or null', () => {
    expect(isValidSpasmEventV2(undefined)).toBe(false);
    expect(isValidSpasmEventV2(null)).toBe(false);
  });

  test('returns false when event is an empty object', () => {
    expect(isValidSpasmEventV2({} as SpasmEventV2)).toBe(false);
  });

  // test('returns false when event is an empty array', () => {
  //   expect(isValidSpasmEventV2([] as SpasmEventV2)).toBe(false);
  // });

  test('returns false when event has no values for signatures, ids, authors, action, title, content', () => {
    expect(isValidSpasmEventV2({ type: 'SpasmEventV2', foo: 'bar' } as SpasmEventV2)).toBe(false);
  });

  test('returns true when event has signatures with authors and action "post"', () => {
    const event: SpasmEventV2 = {
      type: 'SpasmEventV2',
      signatures: [ { value: 'foo' } ],
      authors: [ { addresses: [ { value: 'bar' } ] } ],
      action: 'post'
    };
    expect(isValidSpasmEventV2(event as SpasmEventV2)).toBe(true);
  });

  test('returns false when event has signatures without authors or ids', () => {
    const event: SpasmEventV2 = {
      type: 'SpasmEventV2',
      signatures: [ { value: 'foo' } ],
      action: 'post'
    };
    expect(isValidSpasmEventV2(event as SpasmEventV2)).toBe(false);
  });

  test('returns false when event has action "reply" without a parent', () => {
    const event: SpasmEventV2 = {
      type: 'SpasmEventV2',
      signatures: [ { value: 'foo' } ],
      authors: [ { addresses: [ { value: 'bar' } ] } ],
      action: 'reply'
    };
    expect(isValidSpasmEventV2(event as SpasmEventV2)).toBe(false);
  });

  test('returns true when event has action "reply" with a parent', () => {
    const event: SpasmEventV2 = {
      type: 'SpasmEventV2',
      signatures: [ { value: 'foo' } ],
      authors: [ { addresses: [ { value: 'bar' } ] } ],
      action: 'reply',
      parent: { ids: [ { value: 'id' } ] }
    };
    expect(isValidSpasmEventV2(event as SpasmEventV2)).toBe(true);
  });

  test('returns false when event has action "react" without a parent', () => {
    const event: SpasmEventV2 = {
      type: 'SpasmEventV2',
      signatures: [ { value: 'foo' } ],
      authors: [ { addresses: [ { value: 'bar' } ] } ],
      action: 'react'
    };
    expect(isValidSpasmEventV2(event as SpasmEventV2)).toBe(false);
  });

  test('returns true when event has action "react" with a parent', () => {
    const event: SpasmEventV2 = {
      type: 'SpasmEventV2',
      signatures: [ { value: 'foo' } ],
      authors: [ { addresses: [ { value: 'bar' } ] } ],
      action: 'react',
      parent: { ids: [ { value: 'id' } ] }
    };
    expect(isValidSpasmEventV2(event as SpasmEventV2)).toBe(true);
  });

  test('returns true when event has ids', () => {
    const event: SpasmEventV2 = {
      type: 'SpasmEventV2',
      ids: [ { value: '123' } ]
    };
    expect(isValidSpasmEventV2(event as SpasmEventV2)).toBe(true);
  });
});


const { areValidSpasmEventsV2 } = useUtils()

describe('areValidSpasmEventsV2', () => {
  test('areValidSpasmEventsV2 returns true if all events are valid', () => {
    const validPost: SpasmEventV2 = {
      type: 'SpasmEventV2',
      ids: [ { value: '123' } ]
    };

    const validPostSig: SpasmEventV2 = {
      type: 'SpasmEventV2',
      signatures: [ { value: 'foo' } ],
      authors: [ { addresses: [ { value: 'bar' } ] } ],
      action: 'react',
      parent: { ids: [ { value: 'id' } ] }
    };

    const validPosts1 = [validPost];
    const result1 = areValidSpasmEventsV2(validPosts1);
    expect(result1).toBe(true);

    const validPosts2 = [validPost, validPostSig];
    const result2 = areValidSpasmEventsV2(validPosts2);
    expect(result2).toBe(true);
  });

  test('areValidPosts returns false if any post is invalid', () => {
    const validPost: SpasmEventV2 = {
      type: 'SpasmEventV2',
      ids: [ { value: '123' } ]
    };

    const invalidPostNoIdsSigsEtc: SpasmEventV2 = {
      type: 'SpasmEventV2', 
      source: { name: "source"}
    };

    const invalidPostSigActionButNoParent: SpasmEventV2 = {
      type: 'SpasmEventV2',
      signatures: [ { value: 'foo' } ],
      action: 'post'
    };

    const invalidPosts1 = [validPost, invalidPostNoIdsSigsEtc];
    const result1 = areValidSpasmEventsV2(invalidPosts1);
    expect(result1).toBe(false);

    const invalidPosts2 = [validPost, invalidPostSigActionButNoParent];
    const result2 = areValidSpasmEventsV2(invalidPosts2);
    expect(result2).toBe(false);
  });

  test('areValidSpasmEventsV2 returns false if posts is undefined', async () => {
    const result = areValidSpasmEventsV2(undefined);
    expect(result).toBe(false);
  });

  test('areValidPosts returns false if posts is not an array', async () => {
    const result = areValidSpasmEventsV2({} as SpasmEventV2[]);
    expect(result).toBe(false);
  });

  test('areValidPosts returns false if posts is an empty array', async () => {
    const result = areValidPosts([]);
    expect(result).toBe(false);
  });
})

const { deleteMatchingValuesFromObject } = useUtils()

describe('deleteMatchingValuesFromObject', () => {
  test('should return an object with "qwerty"', () => {
    const input1 = {
      id: 1,
      title: "Some title",
      tags: ["qwerty", "asdfgh"]
    }

    const input2 = {
      id: 1,
      title: "Some title",
      tags: ["qwerty"]
    }

    const output = {
      id: 1,
      title: "Some title",
      tags: ["asdfgh"]
    }

    expect(deleteMatchingValuesFromObject(input1, input2)).toEqual(output);
  })

  test('should return an object without matching values', () => {
  // const addresses = {
    const currentState = {
      nostr: {
        kind: {
          any: [
            "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr0z",
            "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6"
          ],
          0: [
            "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr0z",
            "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6"
          ],
          10002: [
            "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6"
          ],
          1: [
            "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr0z",
            "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6"
          ],
        }
      }
    }

    const checkedState = {
      nostr: {
        kind: {
          any: [
            "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6",
            "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr0z"
          ],
          0: [
            "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr0z"
          ],
          10002: [
            "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr0z"
          ],
          1: [

          ],
        }
      }
    }

    const result = {
      nostr: {
        kind: {
          any: [
          ],
          0: [
            "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6"
          ],
          10002: [
            "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6"
          ],
          1: [
            "npub1kwnsd0xwkw03j0d92088vf2a66a9kztsq8ywlp0lrwfwn9yffjqspcmr0z",
            "npub14slk4lshtylkrqg9z0dvng09gn58h88frvnax7uga3v0h25szj4qzjt5d6"
          ],
        }
      }
    }

    expect(deleteMatchingValuesFromObject(
      currentState,
      checkedState
    )).toEqual(result);
  });

  test('should handle invalid types', () => {
    expect(deleteMatchingValuesFromObject(
      null, null
    )).toEqual(null);
    expect(deleteMatchingValuesFromObject(
      undefined, null
    )).toEqual(undefined);
    expect(deleteMatchingValuesFromObject(
      0, null
    )).toEqual(0);
    expect(deleteMatchingValuesFromObject(
      123, 123
    )).toEqual(123);
    expect(deleteMatchingValuesFromObject(
      "abc", "abc"
    )).toEqual("abc");
    expect(deleteMatchingValuesFromObject(
      true, false
    )).toEqual(true);
    expect(deleteMatchingValuesFromObject(
      false, true
    )).toEqual(false);
  });
});

// sliceAddress
describe('sliceAddress-each', () => {
  const { sliceAddress } = useUtils();

  test.each([
    ['1234567', 2, 4, '12...4567'],
    ['12345678', 3, 2, '123...78'],
    ['123456789', 4, undefined, '1234...6789'],
    [null, 5, 4, ''],
    [undefined, undefined, undefined, ''],
    ['1234', 0, 4, '...1234'],
  ])('given %s and %d as arguments, returns %s', (input, start, end, expected) => {
    const result = sliceAddress(input, start, end);
    expect(result).toEqual(expected);
    expect(result).to.be.a('string');
  });
});

// randomNumber
describe('randomNumber-each', () => {
  const { randomNumber } = useUtils();

  test.each([
    [1, 10], // min, max
    [100, 200],
    [Number.MIN_VALUE, Number.MAX_VALUE],
    [-10, 10],
  ])('returns a random number between %d and %d', (min, max) => {
    const result = randomNumber(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });
});


const { sanitizeObjectValuesWithDompurify } = useUtils()

describe('sanitizeObjectValuesWithDompurify', () => {
  test('should return an object without malicious code', () => {
// DOMPurify.sanitize('<img src=x onerror=alert(1)//>'); // becomes <img src="x">
// DOMPurify.sanitize('<svg><g/onload=alert(2)//<p>'); // becomes <svg><g></g></svg>
// DOMPurify.sanitize('<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>'); // becomes <p>abc</p>
// DOMPurify.sanitize('<math><mi//xlink:href="data:x,<script>alert(4)</script>">'); // becomes <math><mi></mi></math>
// DOMPurify.sanitize('<TABLE><tr><td>HELLO</tr></TABL>'); // becomes <table><tbody><tr><td>HELLO</td></tr></tbody></table>
// DOMPurify.sanitize('<UL><li><A HREF=//google.com>click</UL>'); // becomes <ul><li><a href="//google.com">click</a></li></ul>
    const objectWithMaliciousCode = {
      kind: 1,
      created_at: 1337,
      tags: [
        [
          "one",
          "<img src=x onerror=alert(1)//>"
        ],
        [
          "two",
          "<svg><g/onload=alert(2)//<p>"
        ],
        [
          "license",
          "SPDX-License-Identifier: CC0-1.0"
        ]
      ],
      content: "Some malicious content like <TABLE><tr><td>HELLO</tr></TABL>",
      pubkey: "0x123",
      object: {
        string: "<UL><li><A HREF=//google.com>click</UL>",
        array: [
          "<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>",
          '<math><mi//xlink:href="data:x,<script>alert(4)</script>">'
        ]
      },
    };

    const objectWithoutMaliciousCode = {
      kind: 1,
      created_at: 1337,
      tags: [
        [
          "one",
          '<img src="x">'
        ],
        [
          "two",
          "<svg><g></g></svg>"
        ],
        [
          "license",
          "SPDX-License-Identifier: CC0-1.0"
        ]
      ],
      content: "Some malicious content like <table><tbody><tr><td>HELLO</td></tr></tbody></table>",
      pubkey: "0x123",
      object: {
        string: '<ul><li><a href="//google.com">click</a></li></ul>',
        array: [
          "<p>abc</p>",
          '<math><mi></mi></math>'
        ]
      },
    };

    /**
     * We should create a deep copy of an object using
     * JSON.parse and JSON.stringify, e.g.:
     * const input = JSON.parse(JSON.stringify(validDmpEvent));
     */
    // const input = JSON.parse(JSON.stringify(objectWithMaliciousCode))
    // const output = JSON.parse(JSON.stringify(objectWithoutMaliciousCode))

    // Currently disabled.
    // Option 1. From spasm.js with isomorphic-dompurify.
    // spasm.sanitizeEvent(input)
    // Option 2. Local implementation with DOMPurify.
    // sanitizeObjectValuesWithDompurify(input)
    // expect(input).toEqual(output);

    // DOMPurify does work, I've tested it manually, but
    // it gives an error when running 'npm test'.
    // I've also tested spasm.sanitizeEvent, which uses
    // isomorphic-dompurify, which uses dompurify with
    // JSDOM, and it also works, but gives an error when
    // running 'npm test'.
    // Error (DOMPurify):
    // default.sanitize is not a function
    // Error (spasm.sanitizeEvent with isomorphic-dompurify):
    // spasm.sanitize is not a function
    // The error suggests that the DOMPurify instance is not
    // initialized correctly, e.g. because the `window` object
    // is not available in the testing environment.
    // spasm.sanitizeEvent() works fine in backend tests.
    // TODO: investigate and write tests for DOMPurify

  });
})
