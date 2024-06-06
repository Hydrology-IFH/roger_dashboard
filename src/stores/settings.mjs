import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettings = defineStore(
  'settings',
  () => {
    // other stuff
    /////////////////////////////////////
    const timeseries_decimals = ref(3)
    const crs_epsg = ref(25832)

    const map_default_basemap = ref("basemap_color")
    const map_default_colorscale = ref("inferno")
    const map_default_opacity = ref(100)
    const map_default_hover_decimals = ref(3)

    return {
      timeseries_decimals,
      map_default_basemap,
      crs_epsg,
      map_default_colorscale,
      map_default_opacity,
      map_default_hover_decimals
    }
  },
  { persist: true }
)
