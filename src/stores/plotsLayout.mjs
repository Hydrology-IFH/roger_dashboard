import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePlotsLayout = defineStore(
  'plots_layout',
  () => {
    const colNum = ref(16)
    const layout = ref([])
    return {
      colNum,
      layout
    }
  }
)

export const usePlotsLayoutDefault = defineStore(
  'plots_layout_defaults',
  () => {
    const colNum = ref(16)
    const layout = ref([
      { x: 0, y: 0, w: 8, h: 4, i: 0, plotKey: "OATimeserie" },
      { x: 8, y: 0, w: 8, h: 8, i: 1, plotKey: "Map" }
    ])
    return {
      colNum,
      layout
    }
  },
  { persist: true }
)
