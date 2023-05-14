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


const { isValidPost } = useUtils()

describe('isValidPost', () => {
  test('returns false when post is undefined', () => {
    expect(isValidPost(undefined)).toBe(false);
  });

  test('returns false when post is an empty object', () => {
    expect(isValidPost({})).toBe(false);
  });

  test('returns false when post is an empty array', () => {
    expect(isValidPost([])).toBe(false);
  });

  test('returns false when post has no values for signature, url, or id', () => {
    expect(isValidPost({ foo: 'bar' })).toBe(false);
  });

  test('returns true when post has a signature with action "post"', () => {
    const post = { signature: 'foo', action: 'post' };
    expect(isValidPost(post)).toBe(true);
  });

  test('returns false when post has a signature with an invalid action', () => {
    const post = { signature: 'foo', action: 'invalid' };
    expect(isValidPost(post)).toBe(false);
  });

  test('returns true when post has a signature with action "reply" and a target', () => {
    const post = { signature: 'foo', action: 'reply', target: 'bar' };
    expect(isValidPost(post)).toBe(true);
  });

  test('returns false when post has a signature with action "reply" and no target', () => {
    const post = { signature: 'foo', action: 'reply' };
    expect(isValidPost(post)).toBe(false);
  });

  test('returns true when post has a signature with action "react" and a target', () => {
    const post = { signature: 'foo', action: 'react', target: 'bar' };
    expect(isValidPost(post)).toBe(true);
  });

  test('returns false when post has a signature with action "react" and no target', () => {
    const post = { signature: 'foo', action: 'react' };
    expect(isValidPost(post)).toBe(false);
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

    const validPosts2 = [validPost, validPostSig];
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

    const invalidPosts3 = [validPost, invalidPostSigActionButNoTarget];
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
    const result = areValidPosts({});
    expect(result).toBe(false);
  });

  test('areValidPosts returns false if posts is an empty array', async () => {
    const result = areValidPosts([]);
    expect(result).toBe(false);
  });
})
