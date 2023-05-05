<template>
  <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
    <!-- activities -->
    <span v-if="activities">
      <span v-if="activities[0]" class="float-left ml-1">
        <FeedFiltersMenuButton v-for="activity in activities" class="first-letter:uppercase" :filterName="activity"
          :filterSelected="feedFilters.activity" @filter-clicked="filterActivityClicked">
          {{activity}}
        </FeedFiltersMenuButton>
      </span>
    </span>

    <!-- categories -->
    <span v-if="categories">
      <span v-if="categories[0]" class="float-right mr-4">
        <FeedFiltersMenuButton v-for="category in categories" class="uppercase mr-1" :filterName="category"
          :filterSelected="feedFilters.category" @filter-clicked="filterCategoryClicked">
          {{category}}
        </FeedFiltersMenuButton>
      </span>
    </span>

  </span>
</template>

<script setup lang="ts">
import {FiltersActivity, FiltersCategory} from '@/helpers/interfaces';
const { feedFilters, changeFeedFiltersActivity, changeFeedFiltersCategory } = useFeedFilters()

// state
const activities: FiltersActivity[] = [
  'hot',
  'rising',
  'all',
]

const categories: FiltersCategory[] = [
  'defi',
  'nft',
  'any',
]

// methods
const filterActivityClicked = (newFilter: FiltersActivity):void => {
  changeFeedFiltersActivity(newFilter)
}

const filterCategoryClicked = (newFilter: FiltersCategory):void => {
  changeFeedFiltersCategory(newFilter)
}

</script>

<style scoped>

</style>
