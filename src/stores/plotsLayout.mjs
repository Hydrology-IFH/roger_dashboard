import { ref } from 'vue'
import { defineStore } from 'pinia'

const innerUsePlotsLayout = defineStore('plots_layout', {
  state: () => {
    const colNum = ref(16)
    const layout = ref([])
    return {
      colNum,
      layout
    }
  },
  actions: {
    setDefaultLayout() {
      let layoutDefaultStore = innerUsePlotsLayoutDefault();
      console.log("setting default layout", layoutDefaultStore.layout)
      this.layout = JSON.parse(JSON.stringify(layoutDefaultStore.layout));
    }
  },
})

const innerUsePlotsLayoutDefault = defineStore('plots_layout_defaults',
  {
    state: () => {
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
    actions: {
      setActualLayout() {
        let layoutStore = innerUsePlotsLayout();
        this.layout = JSON.parse(JSON.stringify(layoutStore.layout));
      }
    },
  persist: {
    key: "PlotsLayoutDefault",
    afterRestore: () => {
      let layoutStore = innerUsePlotsLayout();
      layoutStore.setDefaultLayout();
    }
  },
}

)

export const usePlotsLayoutDefault = () => {
  return innerUsePlotsLayoutDefault();
}

export const usePlotsLayout = () => {
  usePlotsLayoutDefault()
  return innerUsePlotsLayout();
}
