<script setup>
  import { ref, watchEffect, onMounted, watch } from 'vue'
  import TileLayer from 'ol/layer/WebGLTile.js';
  import GeoTIFF from 'ol/source/GeoTIFF.js';
  import { Map, View } from 'ol';
  import { buffer } from 'ol/extent';

  import  { get_colorscale_tileLayer_style } from './utils/styles'
  import { basemap_sources } from './utils/basemap'
  import hoverOverlay from './utils/hoverOverlay.vue'
  import mapSettingsApp from './utils/mapSettings.vue'
  import { LayerLibrary } from './utils/layer_library/Library.js'
  import { useSettings } from '../../stores/settings'
  import { useControlFile } from '../../stores/controlFile'

  // define variables
  const settings = new useSettings()
  const controlFile = useControlFile()
  const map_dom = ref(null)
  const cont = {}
  const map_created = ref(false)
  const layer_lib = ref(new LayerLibrary(controlFile.output_files))
  const map_settings = {
    opacity: ref(settings.map_default_opacity),
    hover_decimals: ref(settings.map_default_hover_decimals),
    basemap: ref(settings.map_default_basemap),
    colorscale: ref(settings.map_default_colorscale)
  }
  const id = ref(0)

  // load data from file
  const olayer = new TileLayer()
  const basemap_layer = new TileLayer({
    title: "Basemap",
    source: basemap_sources[map_settings.basemap]
  })

  // create openlayer map
  // ---------------------
  onMounted(async () => {
    const tif_src = await olayer.getSource()
    var view = new View({
        projection: 'EPSG:25832',
        center: [0, 0],
        showFullExtent: false,
        zoom: 1
      });
    if (tif_src !== null) {
      view = await tif_src.getView();
    }
    const extent = view.getViewStateAndExtent().extent
    cont["map"] = new Map({
      target: map_dom.value,
      layers: [
        basemap_layer,
        olayer
      ],
      view: new View({
        projection: view.projection,
        center: view.center,
        extent: buffer(extent, Math.abs(extent[2] - extent[0]) / 2),
        showFullExtent: true,
        zoom: 14
      }),
    });
    cont["map"].getView().fit(
      extent,
      cont["map"].getSize());
    map_created.value = true
  })

  // watch settings changes
  // ----------------------
  // basemap
  watchEffect(() => {
    if (layer_lib.value.selectedLayer !== null) {
      basemap_layer.setSource(basemap_sources[map_settings.basemap.value])
    } else {
      basemap_layer.setSource(basemap_sources.blank)
    }
  })
  // colorscale
  watchEffect(() => {
    olayer.setStyle(get_colorscale_tileLayer_style(0, 10, map_settings.colorscale.value, true))
  })
  // opacity
  watchEffect(() => {
    olayer.setOpacity(map_settings.opacity.value / 100)
  })
  // update layer library
  watchEffect(() => {
    layer_lib.value.update(controlFile.output_files)
  })
  // layer selection
  watchEffect(async () => {
    let layer_obj = layer_lib.value.selectedLayer
    if (layer_obj == null) {
      olayer.setSource(null)
      return
    }
    try {
      const tif_resp = await window.electron.ipcRenderer
        .invoke("get-file", window.nodePath.join(controlFile.output_folder, layer_obj.path))
      if (tif_resp == null || tif_resp == "404") {
        return
      }
      const tif_blob = new Blob([tif_resp.buffer], {type: 'image/tiff'})
      olayer.setSource(new GeoTIFF({
        sources: [
          {
            bands: [1],
            blob: tif_blob
          }
        ],
        sourceOptions: {
          allowFullFile: false,
        },
        interpolate: false,
        normalize: false
      }));

      const tif_view = await olayer.getSource().getView();
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
    } catch (error) {
      console.error(error)
    }
  })



</script>

<template>
  <div class="plot" ref="map_dom">
    <hoverOverlay v-if="map_created" :map="cont.map" :olayer="olayer" :decimals="map_settings.hover_decimals.value" :llayer="layer_lib.selectedLayer"/>
    <mapSettingsApp v-if="map_created" :map="cont.map" :map_settings="map_settings" :layer_lib="layer_lib"/>
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