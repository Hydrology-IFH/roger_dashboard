<script setup>
  import { ref, onMounted } from 'vue';
  import { containsCoordinate } from 'ol/extent.js';
  import Overlay from 'ol/Overlay.js';

  const props = defineProps({
    map: Object,
    olayer: Object,
    llayer: Object,
    unit: { type: String, default: "mm" },
    decimals: { type: Number, default: 2}
  })

  const hover_div = ref(null)
  const hover_text = ref("")
  const hover_active = ref(false)

  // create overlay
  onMounted(() => {
    const overlay = new Overlay({
      element: hover_div.value,
      className: 'ov-hover',
      autoPan: false,
      positioning: 'bottom-left',
    });
    props.map.addOverlay(overlay);
    hover_active.value = true;

    // update hover value
    let map_view = props.map.getView();

    props.map.on('pointermove', (evt) => {
      if (props.olayer.getSource() === null) return;
      if (evt.dragging) {
        overlay.setPosition(undefined);
        return;
      }
      //  check if pointer on map
      let pixel = props.map.getEventPixel(evt.originalEvent);
      let view_extent = map_view.getViewStateAndExtent().extent;
      if (!containsCoordinate(view_extent, evt.coordinate)) {
        overlay.setPosition(undefined);
        return;
      }

      // update the hover value
      let pix_value = props.olayer.getData(pixel);
      if ((pix_value != null) && (pix_value[1] != 0)) {
        overlay.setPosition(evt.coordinate);
        let dec = props.decimals;
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
    margin-left: 4px;
    margin-bottom: 4px;
    box-shadow: 0px 0px 2px 2px rgba(255,255,255,0.62);
    pointer-events: none!important;
  }
</style>