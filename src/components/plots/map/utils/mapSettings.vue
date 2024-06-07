<script setup>
  import { ref, onMounted } from 'vue';
  import Overlay from 'ol-ext/control/Overlay.js';
  import Toggle from 'ol-ext/control/Toggle.js';

  import SelectInput from '~/components/inputs/SelectionInput.vue'
  import DecimalsInput from '~/components/inputs/DecimalsInput.vue'
  import LayerSelection from './LayerSelection.vue'
  import SwitchInput from '~/components/inputs/SwitchInput.vue'

  const props = defineProps({
    map: Object,
    map_settings: Object,
    layer_lib: Object
  })
  const map_settings = props.map_settings
  const app_div = ref(null)

  onMounted(() => {
    // Overlay
    const overlay = new Overlay({
      content: app_div.value,
      closeBox : false,
      className: "slide-left map-menu"
    });
    props.map.addControl(overlay);
    app_div.value.style.visibility = 'visible';

    // A toggle control to show/hide the menu
    var t = new Toggle({
      html: '<i class="bi bi-list"></i>',
      className: "map-menu",
      title: "Menu",
      onToggle: function() { overlay.toggle(); }
    });
    props.map.addControl(t);

    app_div.value.querySelector('.btn-close').addEventListener('click', function() {
      overlay.hide();
    });
  });
</script>

<template>
  <div ref="app_div" class="map-menu-content">
    <div class="header">
      <button class="btn btn-close" role="button" onclick=""></button>
      <h3>Map Menu</h3>
    </div>
    <div class="scrollable">
      <h4>Layer Selection</h4>
      <div class="mb-2">
        <LayerSelection :layer_lib="props.layer_lib" :group_lib="props.layer_lib"/>
      </div>
      <h4>Map Settings</h4>
      <SelectInput name="Basemap" v-model="map_settings.basemap.value" :sel_options="['osm', 'basemap_color', 'basemap_grey', 'blank']" tooltipMsg="The basemap to use in the map"/>
      <SelectInput name="Colorscale" v-model="map_settings.colorscale.value" :sel_options="['inferno', 'viridis', 'plasma', 'magma']" tooltipMsg="The colorscale to use in the map"/>
      <SwitchInput name="reverse the Colorscale" v-model="map_settings.colorscale_reverse.value" tooltipMsg="Should the colorscale be reversed"/>
      <DecimalsInput v-model="map_settings.hover_decimals.value" :min=0 :max=6 tooltipMsg="Select the number of decimals to round the hover label to." name="Hover decimals"/>
      <DecimalsInput v-model="map_settings.opacity.value" :min=0 :max=100 tooltipMsg="Select the opacity of the map" name="Opacity"/>
    </div>
  </div>
</template>

<style scoped>
  /* style the close box */
  .map-menu-content .btn-close {
    position: absolute;
    right: 0em;
    top: 0em;
    left: auto;
  }
  .map-menu-content{
    position: absolute;
    padding-top: 0em;
    padding-right: 0.5em;
    font-size: 0.9em;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .scrollable{
    overflow-y: auto;
  }
  .header{
    position: sticky;
    width: 100%;
    height: fit-content;
    padding-top: 0;
  }
</style>
<style>
  /* menu button */
  .ol-control.map-menu {
    top: 0.5em;
    left: 0.5em;
  }
  /* main menu window */
  .ol-overlay.map-menu {
    min-width: 300px;
    max-width: 50%;
    background: #fff;
    color: #333;
    box-shadow: 0px 0px 5px #000;
    padding: 0.5em;
    -webkit-transition: all 0.25s;
    transition: all 0.25s;
    border-left:#6b6b6bc9 solid 1px;
    border-top:#6b6b6bc9 solid 1px;
    border-bottom:#6b6b6bc9 solid 1px;
  }
</style>