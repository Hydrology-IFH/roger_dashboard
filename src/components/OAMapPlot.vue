<script setup>
  import { useSettings } from '../stores/settings'
  import { ref, watchEffect, onMounted } from 'vue'
  import TileLayer from 'ol/layer/WebGLTile.js';
  import GeoTIFF from 'ol/source/GeoTIFF.js';
  import { Map, View } from 'ol';
  import { buffer } from 'ol/extent';

  import  { get_colorscale_tileLayer_style } from './map_utils/styles'
  import { basemap_sources } from './map_utils/basemap'
  import hoverOverlay from './map_utils/hoverOverlay.vue'
import { dot$1 } from 'plotly.js-dist';

  const settings = useSettings()
  const cont = {}
  const map_created = ref(false)
  window.cont = cont
  window.buffer = buffer

  // load data from file
  const oa_layer = new TileLayer()
  const basemap = new TileLayer({
        title: "Basemap",
        source: basemap_sources[settings.basemap]
  })

  // watch settings
  watchEffect(() => {
    basemap.setSource(basemap_sources[settings.basemap])
  })
  watchEffect(() => {
    oa_layer.setStyle(get_colorscale_tileLayer_style(0, 10, settings.colorscale, true))
  })
  watchEffect(async () => {
    oa_layer.setSource(new GeoTIFF({
      sources: [
        {
          bands: [1],
          url: settings.roger_oa_tiff_file
        }
      ],
      sourceOptions: {
        allowFullFile: true,
      },
      interpolate: false,
      normalize: false
    }));
    const tif_view = await oa_layer.getSource().getView();
    if ("map" in cont) {
      cont["map"].setView(new View({
        projection: tif_view.projection,
        center: tif_view.center,
        extent: buffer(tif_view.extent, Math.abs(tif_view.extent[1] - tif_view.extent[0]) / 2),
        showFullExtent: true,
      }));
    }
  })

  //  openlayer map
  onMounted(async () => {
    const tif_view = await oa_layer.getSource().getView();
    cont["map"] = new Map({
      target: 'oa-map',
      layers: [
        basemap,
        oa_layer
      ],
      view: new View({
        projection: tif_view.projection,
        center: tif_view.center,
        extent: buffer(tif_view.extent, Math.abs(tif_view.extent[1] - tif_view.extent[0]) / 2),
        showFullExtent: true,
        zoom: 14
      }),
    });
    map_created.value = true
  })
  window.map_created = map_created

</script>

<template>
  <div class="plot" id="oa-map">
    <hoverOverlay v-if="map_created" :map="cont.map" :layer="oa_layer" unit="mm"/>
  </div>
</template>

<style scoped>
  .plot {
    width: 100%;
    height: 100%;
    min-width: 400px;
    min-height: 400px || 100vh;
  }
  .ol-viewport {
    overflow: visible !important;
  }
  .ol-viewport canvas.ol-fixedoverlay {
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%
  }
</style>