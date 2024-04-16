<script setup>
  // TODO: Der hover funktioniert noch nicht
  import { ref, onMounted } from 'vue';
  import { containsCoordinate } from 'ol/extent.js';
  import Overlay from 'ol/Overlay.js';
  import { useSettings } from '../../../stores/settings'

  const settings = useSettings()

  const props = defineProps({
    map: Object,
    layer: Object,
    unit: { type: String, default: "mm" }
  })

  const hover_div = ref(null)
  const hover_text = ref("")
  const hover_active = ref(true)

  onMounted(() => {
    const overlay = new Overlay({
          element: hover_div.value,
          className: 'ov-hover',
          autoPan: false,
          positioning: 'bottom-left',
        });
    props.map.addOverlay(overlay);
    hover_div.value.style.visibility = 'visible';

    // update hover value
    let map_view = props.map.getView();
    props.map.on('pointermove', (evt) => {
      if (evt.dragging) {
        overlay.setPosition(undefined);
        return;
      }
      let pixel = props.map.getEventPixel(evt.originalEvent);
      let view_extent = map_view.getViewStateAndExtent().extent;
      if (!containsCoordinate(view_extent, evt.coordinate)) {
        overlay.setPosition(undefined);
        return;
      }

      let pix_value = props.layer.getData(pixel);
      if ((pix_value != null) && (pix_value[1] != 0)) {
        overlay.setPosition(evt.coordinate);
        let dec = settings.decimals;
        hover_text.value = `${Math.round(parseFloat(pix_value[0]) * 10 ** dec) / 10 ** dec} ${props.unit}`;
      } else {
        overlay.setPosition(undefined);
      }
    });

    // additional event listener to make hover disappear on exiting map
    props.map.getViewport().addEventListener('pointerleave', () => {
      overlay.setPosition(undefined);
    });

  });
</script>

<template>
  <div class="hover" ref="hover_div"
    v-bind:style="[hover_active ? { 'visibility': 'visible' } : {'visibility':'hidden'}]">
    {{ hover_text }}
  </div>
</template>

<style scoped>
  .hover {
    position: relative;
    width: max-content;
    z-index: 100;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    margin: 2px;
    box-shadow: 0px 0px 2px 2px rgba(255,255,255,0.62);
    pointer-events: none;
    visibility: hidden;
  }
</style>