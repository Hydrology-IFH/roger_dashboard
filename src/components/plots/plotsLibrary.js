import MapPlot from './Map.vue';
import OATimeseriePlot from './OATimeserie.vue';

export const plotsLibrary = {
  lib: [
    {label:"Map", key: "Map", component: MapPlot},
    {label:"OA-Timeserie", key: "OATimeserie", component: OATimeseriePlot}
  ],
  getPlot(key){
    let plot = this.lib.find(p => p.key === key)
    if (plot){
      return plot.component
    }
    return null
  }
}