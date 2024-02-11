import {describe, it, expect} from 'vitest'
import {useFeedFilters} from './useFeedFilters'

describe('useFeedFilters', () => {
  it('should reset the feed filters to their default values', () => {
    const {resetFeedFiltersLimits, feedFilters, feedFiltersDefault, increaseFeedFiltersLimits, feedFiltersStep, changeFeedFiltersActivity, changeFeedFiltersCategory} = useFeedFilters()

    // Test for undefined
    expect(feedFilters.limitWeb2).to.not.be.undefined
    expect(feedFilters.limitWeb3).to.not.be.undefined
    expect(feedFiltersDefault.limitWeb2).to.not.be.undefined
    expect(feedFiltersDefault.limitWeb3).to.not.be.undefined
    expect(feedFiltersStep.limitWeb2).to.not.be.undefined
    expect(feedFiltersStep.limitWeb3).to.not.be.undefined

    // Test default limits
    expect(feedFilters.limitWeb2).toBe(feedFiltersDefault.limitWeb2)
    expect(feedFilters.limitWeb3).toBe(feedFiltersDefault.limitWeb3)

    // Test default increase step
    resetFeedFiltersLimits()
    increaseFeedFiltersLimits()

    expect(feedFilters.limitWeb2).to.not.equal(feedFiltersDefault.limitWeb2)
    expect(feedFilters.limitWeb3).to.not.equal(feedFiltersDefault.limitWeb3)

    expect(feedFilters.limitWeb2).toBe(feedFiltersDefault.limitWeb2 + feedFiltersStep.limitWeb2)
    expect(feedFilters.limitWeb3).toBe(feedFiltersDefault.limitWeb3 + feedFiltersStep.limitWeb3)

    // Test custom increase step
    resetFeedFiltersLimits()
    const customFeedFiltersStep = {
      limitWeb2: 3,
      limitWeb3: 6
    }

    increaseFeedFiltersLimits(customFeedFiltersStep.limitWeb2, customFeedFiltersStep.limitWeb3)

    expect(feedFilters.limitWeb2).to.not.equal(feedFiltersDefault.limitWeb2)
    expect(feedFilters.limitWeb3).to.not.equal(feedFiltersDefault.limitWeb3)

    expect(feedFilters.limitWeb2).toBe(feedFiltersDefault.limitWeb2 + customFeedFiltersStep.limitWeb2)
    expect(feedFilters.limitWeb3).toBe(feedFiltersDefault.limitWeb3 + customFeedFiltersStep.limitWeb3)

    // Test reset limits
    resetFeedFiltersLimits()
    expect(feedFilters.limitWeb2).toBe(feedFiltersDefault.limitWeb2)
    expect(feedFilters.limitWeb3).toBe(feedFiltersDefault.limitWeb3)

    // Test default activity filter
    resetFeedFiltersLimits()
    expect(feedFilters.activity).toBe("all")

    // Test changing feed filters activity
    resetFeedFiltersLimits()
    changeFeedFiltersActivity("hot")
    expect(feedFilters.activity).toBe("hot")

    // Test default category filter
    resetFeedFiltersLimits()
    expect(feedFilters.category).toBe("any")

    // Test changing feed filters category
    resetFeedFiltersLimits()
    changeFeedFiltersCategory("defi")
    expect(feedFilters.category).toBe("defi")
  })
})
