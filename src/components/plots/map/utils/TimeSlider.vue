<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import Overlay from 'ol-ext/control/Overlay.js';
  import Button from 'ol-ext/control/Button.js';

  // define variables
  // const layer = defineModel({required: true})
  const props = defineProps({
    map: Object,
    layer: Object
  })
  const comp_div = ref(null)

  // create legend overlay
  var overlay = null;
  var btnOpen = null;
  onMounted(() => {
    // Overlay for Legend
    overlay = new Overlay({
      content: comp_div.value,
      closeBox : false,
      className: "slide-left legend-overlay timescale-overlay"
    });
    props.map.addControl(overlay);
    overlay.show()

    // A toggle control to show/hide the menu
    btnOpen = new Button({
      html: '<i class="bi bi-clock"></i>',
      className: "open-timeslider hidden",
      title: "Legend",
      handleClick: function () {
        overlay.show();
        btnOpen.element.classList.add("hidden");
      }
    });
    props.map.addControl(btnOpen);

    // show/hide slider and button
    watch(isRangeLayer, (value) => {
      if (value) {
        props.map.addControl(btnOpen)
        overlay.show();
      } else {
        props.map.removeControl(btnOpen)
        overlay.hide();
      }
    },
    {immediate: true})
  })

  // legend closer
  const close = () => {
    btnOpen.element.classList.remove("hidden");
    overlay.hide();
  }

  // define computed properties
  const isRangeLayer = computed(() => {
    return props.layer !== null ? props.layer.isRangeLayer : false;
  })
  const min = computed(() => {
    if (isRangeLayer.value) {
      return props.layer.minStep
    }
    return 0
  })
  const max = computed(() => {
    if (isRangeLayer.value) {
      return props.layer.maxStep
    }
    return 0
  })
  const steps = computed(() => {
    if (isRangeLayer.value) {
      return props.layer.steps
    }
    return [0]
  })

  // define selected step
  const selectedStep = ref(0);
  watch(selectedStep, (value) => {
    if (props.layer !== null && isRangeLayer.value) {
      props.layer.selectStep(value, true)
      let actualStep = props.layer.step
      if (actualStep !== value) {
        selectedStep.value = actualStep
      }
    }
  })
  const incrementStep = () => {
    selectedStep.value++
  }
  const decrementStep = () => {
    selectedStep.value--
  }

</script>

<template>
  <div ref="comp_div">
    <button type="button" class="btn btn-close" role="button" @click="close"></button>
    <v-slider v-model="selectedStep" :min="min" :max="max" hide-details thumb-label="always" show-ticks="always"
      color="var(--bs-primary)" :strict="true"
      :steps="steps"
      :step="1">
      <template v-slot:prepend>
        <v-btn
          color="var(--bs-primary)"
          icon="bi-dash"
          size="large"
          variant="outlined"
          density="compact"
          @click="decrementStep"/>
      </template>
      <template v-slot:append>
        <v-btn
          color="var(--bs-primary)"
          icon="bi-plus"
          size="large"
          variant="outlined"
          density="compact"
          @click="incrementStep"/>
        </template>
    </v-slider>
        <div class="colorbar-label">Timestep</div>
  </div>
</template>

<style scoped>
  div.colorbar-label{
    font-weight: 600;
    font-size: 1rem;
    text-align: center;
  }

  /* close button */
  .btn-close {
    position: absolute;
    right: 0em;
    top: 0em;
    left: auto;
    font-size: 1em;
  }

</style>
<style>
  /* legend button */
  .open-timeslider {
    bottom: 2.5em;
    left: 0.5em;
  }
  .open-timeslider.hidden {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s .5s, opacity .5s linear;
  }
  /* legend overlay */
  .legend-overlay{
    height: max-content;
    width: max-content;
    min-width: 85%;
    max-width: 90%;
    overflow: visible;
    margin-left: 2.3em;
    bottom: .5em!important;
    top: auto!important;
    background: #fff9;
    color: #333;
    box-shadow: 0px 0px 5px #000;
    padding: 0.5em;
    padding-right: 1em;
    border-radius: 4px;
    z-index: 1;
  }
  :nth-child(2 of div.legend-overlay.ol-visible){
    margin-bottom: 6em!important;
  }
</style>