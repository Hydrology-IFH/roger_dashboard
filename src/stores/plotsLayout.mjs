import { ref } from 'vue'
import { defineStore } from 'pinia'

const DEFAULT_LAYOUT = [
  { x: 0, y: 0, w: 8, h: 4, i: 0, plotKey: "Hydrograph" },
  { x: 8, y: 0, w: 8, h: 8, i: 1, plotKey: "Map" }
]
export const usePlotsLayout = defineStore('plots_layout', {
  state: () => {
    const colNum = ref(16)
    const layout = ref([])
    const defaults = ref({
      colNum: 16,
      layout: DEFAULT_LAYOUT
    })

    return {
      colNum,
      layout,
      defaults
    }
  },
  actions: {
    setDefaultLayoutAsActual() {
      this.layout = JSON.parse(JSON.stringify(this.defaults.layout));
    },
    setActualLayoutAsDefault() {
      this.defaults.layout = JSON.parse(JSON.stringify(this.layout));
    },
    resetDefaultLayout() {
      this.defaults.layout = DEFAULT_LAYOUT;
    }
  },
  persist: {
    key: "PlotsLayoutDefault",
    paths: ["defaults"],
    afterRestore: (context) => {
      context.store.setDefaultLayoutAsActual();
    }
  }
})