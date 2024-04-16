import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMapSettings = defineStore(
  'mapSettings',
  () => {
    const opacity = ref(100)
    const selected_layer = ref("")
    const hover_decimals = ref(3)
    const basemap = ref("basemap_color")
    const colorscale = ref("inferno")

    return {
      opacity,
      selected_layer,
      hover_decimals,
      basemap,
      colorscale,
    }
  }
)
