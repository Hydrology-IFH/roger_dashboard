import MapPlot from './map/Map.vue';
import Hydrograph from './hydrograph/Hydrograph.vue';

export const plotsLibrary = {
  lib: [
    {label:"Map", key: "Map", component: MapPlot},
    {label:"Hydrograph", key: "Hydrograph", component: Hydrograph},
  ],
  getPlot(key){
    let plot = this.lib.find(p => p.key === key)
    if (plot){
      return plot.component
    }
    return null
  }
}