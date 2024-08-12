<template>
  <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
    <!-- activities -->
    <span v-if="activities">
      <span v-if="activities[0]" class="float-left ml-1">
        <FeedFiltersMenuButton
          v-for="activity in activities"
          class="first-letter:uppercase"
          :block=false
          :filterName="activity"
          :filterSelected="feedFilters.activity"
          @filter-clicked="filterActivityClicked">
          {{activity}}
        </FeedFiltersMenuButton>
      </span>
    </span>

    <div v-if="ifShowCategoriesFilter">
      <!-- Dropdown toggle button -->
      <button
        @click="toggleCategoriesDropDown()"
        class="flex items-center float-right mr-2 p-2 px-2 min-w-[185px]"
      >
        <span class="mr-1">
          Category: 
          <span class="uppercase text-colorPrimary-light dark:text-colorPrimary-dark">
            {{feedFilters.category}}
          </span>
        </span>
        <svg
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>


      <!-- Dropdown menu -->
      <div
        v-show="categoriesDropDownShown"
        class="absolute right-0 top-7 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md mr-3"
      >

      <!-- categories -->
      <span v-if="categories">
        <span v-if="categories[0]" class="float-right mr-4">
          <FeedFiltersMenuButton
            v-for="category in categories"
            class="uppercase mr-1"
            :block=true
            :filterName="category"
            :filterSelected="feedFilters.category"
            @filter-clicked="filterCategoryClicked"
          >
            {{category}}
          </FeedFiltersMenuButton>
        </span>
      </span>

      </div>

    </div>


  </span>
</template>

<script setup lang="ts">
import {FiltersActivity, FiltersCategory} from '@/helpers/interfaces';
const { feedFilters, changeFeedFiltersActivity, changeFeedFiltersCategory } = useFeedFilters()
const ifShowCategoriesFilter = useRuntimeConfig()?.public?.ifShowCategoriesFilter === 'true' ? true : false

// state
const categoriesDropDownShown = ref(false)

const activities: FiltersActivity[] = [
  'hot',
  'rising',
  'all',
]

const categories: FiltersCategory[] = [
  'defi',
  'nft',
  'privacy',
  'politics',
  'tech',
  'any',
]

// methods
const filterActivityClicked = (newFilter: FiltersActivity):void => {
  changeFeedFiltersActivity(newFilter)
}

const filterCategoryClicked = (newFilter: FiltersCategory):void => {
  changeFeedFiltersCategory(newFilter)
  categoriesDropDownShown.value = false
}

const toggleCategoriesDropDown = () => {
  categoriesDropDownShown.value = !categoriesDropDownShown.value
}

</script>

<style scoped>

</style>
