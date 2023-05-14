import {describe, it, expect, vi} from 'vitest'
import { useFeed } from './useFeed'

describe('useFeed', () => {
  it('should show feed', () => {
    const { isFeedShown, showFeed, hideFeed } = useFeed()

    // Test show feed
    expect(isFeedShown.value).toBeFalsy()
    showFeed()
    expect(isFeedShown.value).toBeTruthy()

    // Test hide feed
    // Using fake timers enables advancing timers by time
    vi.useFakeTimers()
    hideFeed()
    vi.advanceTimersByTime(500)
    expect(isFeedShown.value).toBeFalsy()
  })
})

