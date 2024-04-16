<script setup>
  import { useSettings } from '../../stores/settings'
  import {useMapSettings} from '../../stores/mapSettings'
  import { ref, watchEffect, onMounted } from 'vue'
  import TileLayer from 'ol/layer/WebGLTile.js';
  import GeoTIFF from 'ol/source/GeoTIFF.js';
  import { Map, View } from 'ol';
  import { buffer } from 'ol/extent';

  import  { get_colorscale_tileLayer_style } from './utils/styles'
  import { basemap_sources } from './utils/basemap'
  import hoverOverlay from './utils/hoverOverlay.vue'
  import mapSettingsApp from './utils/mapSettings.vue'


  const settings = useSettings()
  const mapSettings = useMapSettings()
  const cont = {}
  const map_created = ref(false)

  // load data from file
  const oa_layer = new TileLayer()
  const basemap = new TileLayer({
        title: "Basemap",
        source: basemap_sources[mapSettings.basemap]
  })

  // watch settings changes
  watchEffect(() => {
    basemap.setSource(basemap_sources[mapSettings.basemap])
  })
  watchEffect(() => {
    oa_layer.setStyle(get_colorscale_tileLayer_style(0, 10, mapSettings.colorscale, true))
  })
  watchEffect(() => {
    oa_layer.setOpacity(mapSettings.opacity / 100)
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
        allowFullFile: false,
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
      cont["map"].getView().fit(
        tif_view.extent,
        cont["map"].getSize());
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
        extent: buffer(tif_view.extent, Math.abs(tif_view.extent[2] - tif_view.extent[0]) / 2),
        showFullExtent: true,
        zoom: 14
      }),
    });
    cont["map"].getView().fit(
      tif_view.extent,
      cont["map"].getSize());
    map_created.value = true
  })

</script>

<template>
  <div class="plot" id="oa-map">
    <hoverOverlay v-if="map_created" :map="cont.map" :layer="oa_layer" unit="mm"/>
    <mapSettingsApp v-if="map_created" :map="cont.map"/>
  </div>
</template>

<style scoped>
  .plot {
    width: 100%;
    min-width: 400px;
    height: calc(100vh - 6rem);
  }
</style>
<style>
  .ol-zoom {
    left: auto!important;
    right: 0.5em!important;
  }
</style>