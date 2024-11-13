import {describe, it, test, expect} from 'vitest'
import { useTime } from "./useTime";
import { Post } from "./../helpers/interfaces";

describe("useTime", () => {
  const { timeAgo } = useTime();

  test("timeAgo returns '' for empty Post object", () => {
    const post: Post = {};
    expect(timeAgo(post)).toBe("");
  });

  test('returns empty string when no post is provided', () => {
    const { timeAgo } = useTime()
    expect(timeAgo()).toBe('')
  })

  test('returns empty string when pubdate and added_time properties are not strings', () => {
    const { timeAgo } = useTime()
    const post = {
      pubdate: 123456789,
      added_time: 987654321
    }
    expect(timeAgo(post)).toBe('')
  })

  test('returns a string when there is no pubdate', () => {
    const { timeAgo } = useTime()
    const post = {
      added_time: '987654321'
    }
    expect(timeAgo(post)).to.be.a('string')
  })

  test('returns time since publication date as a string', () => {
    const { timeAgo } = useTime()
    const post = {
      pubdate: '2022-01-01T00:00:00.000Z'
    }
    expect(timeAgo(post)).to.be.a('string')
  })

  test('returns "new" when post is less than a minute old', () => {
    const { timeAgo } = useTime()
    const post = {
      pubdate: new Date(Date.now() - 30000).toISOString()
    }
    expect(timeAgo(post)).toBe('new')
  })

  // 1 minute = 60000 milliseconds
  test('returns "1m" when post is one minute old', () => {
    const { timeAgo } = useTime()
    const post = {
      added_time: new Date(Date.now() - 60000).toISOString()
    }
    expect(timeAgo(post)).toBe('1m')
  })

  // 1 minute = 60000 milliseconds
  test('returns "2m" when post is two minutes old', () => {
    const { timeAgo } = useTime()
    const post = {
      added_time: new Date(Date.now() - 120000).toISOString()
    }
    expect(timeAgo(post)).toBe('2m')
  })

  // 1 hour = 3600000 milliseconds
  test('returns "1h" when post is one hour old', () => {
    const { timeAgo } = useTime()
    const post = {
      pubdate: new Date(Date.now() - 3600000).toISOString()
    }
    expect(timeAgo(post)).toBe('1h')
  })

  // 1 day = 86400000 milliseconds
  test('returns "1d" when post is one day old', () => {
    const { timeAgo } = useTime()
    const post = {
      added_time: new Date(Date.now() - 86400000).toISOString()
    }
    expect(timeAgo(post)).toBe('1d')
  })

  // 1 month = 2592000000 milliseconds
  test('returns "1mo" when post is one month old', () => {
    const { timeAgo } = useTime()
    const post = {
      pubdate: new Date(Date.now() - 2592000000).toISOString()
    }
    expect(timeAgo(post)).toBe('1mo')
  })

  // 1 year = 31536000000 milliseconds
  test('returns "1y" when post is one year old', () => {
    const { timeAgo } = useTime()
    const post = {
      added_time: new Date(Date.now() - 31536000000).toISOString()
    }
    expect(timeAgo(post)).toBe('1y')
  })
});
