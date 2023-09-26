import {readonly} from 'vue'
import {reactive} from "vue";
import {FeedFilters, FiltersActivity, FiltersCategory} from "@/helpers/interfaces"
import {FeedFiltersStep} from '@/helpers/interfaces';

// Feed filters are declared before the export function because
// that allows to manage global state similar to stores like Pinia.
// In other words, data stored in variables before an export function
// won't be reset for every new component instance it's used in.
const feedFiltersDefault: FeedFilters = {
  webType: false,
  category: "any",
  platform: false,
  source: false,
  activity: "all",
  keyword: false,
  ticker: false,
  limitWeb2: 25,
  limitWeb3: 25,
}

const feedFilters: FeedFilters = reactive({...feedFiltersDefault})

const feedFiltersStep: FeedFiltersStep = {
  limitWeb2: 15,
  limitWeb3: 15,
}

export const useFeedFilters = () => {

  const resetFeedFiltersLimits = () => {
    // console.log("resetFeedFiltersToDefault is called")
    feedFilters.limitWeb2 = feedFiltersDefault.limitWeb2
    feedFilters.limitWeb3 = feedFiltersDefault.limitWeb3
  }

  const increaseFeedFiltersLimits = (limitWeb2?: number, limitWeb3?: number) => {
    if (typeof (feedFilters.limitWeb2) !== "undefined") {
      if (typeof (limitWeb2) === "number" && limitWeb2 >= 0) {
        feedFilters.limitWeb2 += limitWeb2
      } else {
        feedFilters.limitWeb2 += feedFiltersStep.limitWeb2
      }
    }

    if (typeof (feedFilters.limitWeb3) !== "undefined") {
      if (typeof (limitWeb3) === "number" && limitWeb3 >= 0) {
        feedFilters.limitWeb3 += limitWeb3
      } else {
        feedFilters.limitWeb3 += feedFiltersStep.limitWeb3
      }
    }
  }

  const changeFeedFiltersCategory = (newValue: FiltersCategory) => {
    feedFilters.category = newValue
    resetFeedFiltersLimits()
  }

  const changeFeedFiltersActivity = (newValue: FiltersActivity) => {
    feedFilters.activity = newValue
    resetFeedFiltersLimits()
  }

  return {
    feedFilters: readonly(feedFilters),
    feedFiltersDefault: readonly(feedFiltersDefault),
    feedFiltersStep: readonly(feedFiltersStep),
    resetFeedFiltersLimits,
    increaseFeedFiltersLimits,
    changeFeedFiltersCategory,
    changeFeedFiltersActivity,
  }
}
