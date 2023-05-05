<template>
  <div class="inline-block p-1 text-lg cursor-pointer"
    :class="[filterSelected === filterName ? 'text-colorPrimary-light dark:text-colorPrimary-dark' : '']"
    @click="filterClickedEmitUp(filterName)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {FiltersActivity, FiltersCategory} from '@/helpers/interfaces';

defineProps<{
  filterName: FiltersActivity | FiltersCategory
  filterSelected: string | boolean | undefined
}>()

const emit = defineEmits<{
  (e: 'filter-clicked', newFilter: FiltersActivity | FiltersCategory): void
}>()


// methods
const filterClickedEmitUp = (newFilter: FiltersCategory | FiltersActivity): void => {
  emit('filter-clicked', newFilter)
}
</script>

<style scoped>

</style>
