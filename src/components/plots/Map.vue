<script setup>
  import { ref, watchEffect, onMounted, computed } from 'vue'
  import TileLayer from 'ol/layer/WebGLTile.js';
  import GeoTIFF from 'ol/source/GeoTIFF.js';
  import { fromBlob } from "geotiff";
  import { Map, View } from 'ol';
  import { buffer } from 'ol/extent';

  import  { get_colorscale_tileLayer_style } from './map_utils/styles'
  import { basemap_sources } from './map_utils/basemap'
  import hoverOverlay from './map_utils/hoverOverlay.vue'
  import mapSettingsApp from './map_utils/mapSettings.vue'
  import { LayerLibrary } from './map_utils/layer_library/Library.mjs'
  import { useSettings } from '~/stores/settings'
  import { useControlFile } from '~/stores/controlFile'
  import { getUnit } from './map_utils/units.mjs';
  import Legend from './map_utils/Legend.vue';
  import TimeSlider from './map_utils/TimeSlider.vue';
  import { get_reasonable_digits } from '~/components/utils/reasonable_digits'
  import ErrorFrame from '~/components/utils/ErrorFrame.vue'

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
    colorscale: ref(settings.map_default_colorscale),
    colorscale_reverse: ref(settings.map_default_colorscale_reverse),
    tif_range: ref([0, 15]),
    colorscale_range: ref([0, 15])
  }
  const style = ref([])

  // load data from file
  const olayer = new TileLayer()
  const basemap_layer = new TileLayer({
    title: "Basemap",
    source: basemap_sources[map_settings.basemap]
  })

  // update layer label and unit
  const unit = computed(() => {
    if (layer_lib.value.selectedLayer != null) {
      return getUnit(layer_lib.value.selectedLayer.name);
    }
    return ""
  })
  const layer_name = computed(() => {
    if (layer_lib.value.selectedLayer != null) {
      return layer_lib.value.selectedLayer.name;
    }
    return ""
  })
  const sel_layer = computed(() => {
    return layer_lib.value.selectedLayer
  })
  const has_layers = computed(() => layer_lib.value.layers.length > 0)

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
    let map = cont["map"]
    map.getView().fit(
      extent,
      map.getSize());
    map_created.value = true

    // add map spinner
    map.on('loadstart', function () {
      map.getTargetElement().classList.add('spinner');
    });
    map.on('loadend', function () {
      map.getTargetElement().classList.remove('spinner');
    });
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
    style.value = get_colorscale_tileLayer_style(
      map_settings.colorscale_range.value[0],
      map_settings.colorscale_range.value[1],
      map_settings.colorscale.value,
      true,
      map_settings.colorscale_reverse.value)
    olayer.setStyle(style.value)
  })
  // colorscale range
  watchEffect(() => {
    let digits = get_reasonable_digits(map_settings.tif_range.value[0], map_settings.tif_range.value[1])
    let rdigits = Math.pow(10, digits)
    map_settings.colorscale_range.value = new Array(
      Math.floor(map_settings.tif_range.value[0] * rdigits) / rdigits,
      Math.ceil(map_settings.tif_range.value[1] * rdigits) / rdigits)
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
        .invoke("get-file-blob", window.nodePath.join(controlFile.output_folder, layer_obj.path))
      if (tif_resp == null || tif_resp == "404") {
        return
      }
      const tif_blob = new Blob([tif_resp.buffer], { type: 'image/tiff' })
      //  get min max values
      fromBlob(tif_blob)
        .then(tif => tif.getImage())
        .then(img => img.readRasters())
        .then(rasters => {
          map_settings.tif_range.value = [
            rasters[0].reduce((acc, val) => Math.min(acc, val), Infinity),
            rasters[0].reduce((acc, val) => Math.max(acc, val), -Infinity)]
        })
        .catch(err => console.error(err))

      // set source
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

      // set view to tif extent
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
    <hoverOverlay v-if="map_created" :map="cont.map" :olayer="olayer"
      :decimals="map_settings.hover_decimals.value"
      :unit="unit"/>
    <mapSettingsApp v-if="map_created" :map="cont.map" :map_settings="map_settings" :layer_lib="layer_lib"/>
    <Legend v-if="map_created" :layer_name="layer_name" :unit="unit" :map="cont.map" :style="style"/>
    <TimeSlider v-if="map_created" :map="cont.map" :layer="sel_layer"/>
    <ErrorFrame v-if="!has_layers" header="No layers available" msg="There was no TIF layer in your RoGeR result folder"/>
  </div>
</template>

<style scoped>
  .plot {
    width: 100%;
    height: 100%;
    min-width: 10px;
    min-height: 10px;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner:after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    margin-top: -20px;
    margin-left: -20px;
    border-radius: 50%;
    border: 5px solid rgba(180, 180, 180, 0.6);
    border-top-color: rgba(0, 0, 0, 0.6);
    animation: spinner 0.6s linear infinite;
  }
</style>
<style>
  .ol-zoom {
    left: auto!important;
    right: 0.5em!important;
    top: 2.5em;
  }
</style>