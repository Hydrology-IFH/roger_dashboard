<script setup>
  // TODO: Der hover funktioniert noch nicht
  import { ref, onMounted } from 'vue';
  import Overlay from 'ol-ext/control/Overlay.js';
  import Toggle from 'ol-ext/control/Toggle.js';

  import { useMapSettings } from '../../../stores/mapSettings'
  import SelectInput from '../../inputs/SelectionInput.vue'
  import DecimalsInput from '../../inputs/DecimalsInput.vue'

  const mapSettings = useMapSettings()

  const props = defineProps({
    map: Object,
  })

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
    window.overlay = overlay;

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
    <button class="btn btn-close" role="button" onclick=""></button>
    <h3>Map Menu</h3>
    <div class="data">
      <SelectInput name="Basemap" v-model="mapSettings.basemap" :sel_options="['osm', 'basemap_color', 'basemap_grey']" tooltipMsg="The basemap to use in the map"/>
      <SelectInput name="Colorscale" v-model="mapSettings.colorscale" :sel_options="['inferno', 'viridis', 'plasma', 'magma']" tooltipMsg="The colorscale to use in the map"/>
      <DecimalsInput v-model="mapSettings.hover_decimals" :min=0 :max=6 tooltipMsg="Select the number of decimals to round the hover label to." name="Hover decimals"/>
      <DecimalsInput v-model="mapSettings.opacity" :min=0 :max=100 tooltipMsg="Select the opacity of the map" name="Opacity"/>
    </div>
  </div>
</template>

<style scoped>
  /* style the close box */
  .map-menu-content .btn-close {
    position: absolute;
    right: 1em;
    top: 1em;
    left: auto;
  }
  .map-menu-content{
    padding-top: .5em;
    font-size: 0.9em;
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
    width: 30%;
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