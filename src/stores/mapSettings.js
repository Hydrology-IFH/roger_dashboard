import { defineStore } from 'pinia'

import { useSettings } from './settings'

export const useMapSettings = () => {
  const innerStore =  defineStore({
    id:'mapSettings',
    state: () => {
      return {
        default_loaded: false,
        opacity: 100,
        selected_layer: "",
        hover_decimals: 3,
        basemap: "basemap_color",
        colorscale: "inferno",
      }
    },
    actions: {
      loadDefaults() {
        const settings = useSettings()
        this.opacity = settings.map_default_opacity
        this.hover_decimals = settings.map_default_hover_decimals
        this.basemap = settings.map_default_basemap
        this.colorscale = settings.map_default_colorscale
        this.default_loaded = true
      }
    },

  })

  const s = innerStore();
  if (!s.default_loaded) {
    s.loadDefaults();
  }
  return s;
}
