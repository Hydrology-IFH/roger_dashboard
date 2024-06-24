<script setup>
  import { ref, watchEffect, computed } from 'vue'
  import { VuePlotly } from 'vue3-plotly'
  import _ from 'lodash'

  import ErrorFrame from '~/components/utils/ErrorFrame.vue'
  import { getHydrographVariants } from './utils/HydrographVariants'

  // define variables
  const HydrographVariants = ref(getHydrographVariants())

  const possible_variants = computed(() => HydrographVariants.value.filter((variant) => variant.exists))
  const selected_variant = ref(`${HydrographVariants.value[0].name}`)
  // const selected_variant_name = ref("RoGeR - OA Zeitlich")
  const selected_variant_name = ref("RoGeR_dyn - OA & ZA")
  const has_possible_variants = computed(() => possible_variants.value.length > 0)

  // watch for changes in selected_variant_name
  watchEffect(() => {
    if (selected_variant_name.value) {
      selected_variant.value = possible_variants.value.find((v) => v.name === selected_variant_name.value)
    }
  })

  // plotly layout
  const layout = computed(() => {
    const LAYOUT = {
      modebar: {
        remove: ['lasso', 'lasso2d', 'select'],
        orientation: "h"
      },
      xaxis: {
        showgrid: false,
        zeroline: false
      },
      yaxis: {
        minallowed: 0
      },
      showlegend: true,
    }
    return _.merge(LAYOUT, selected_variant.value.layout ?? {})

  })

  // plotly ploting data
  const plot_data = ref([])
  watchEffect(async () => {
    if (selected_variant.value) {
      selected_variant.value.get_plot_data().then((data) => {
        plot_data.value = data
      })
    } else {
      plot_data.value = []
    }
  })
  window.plot_data = plot_data
  window.selected_variant = selected_variant
</script>

<template>
  <div class="select">
    <v-combobox
        label="Hydrograph Variant"
        variant="solo-filled"
        auto-select-first
        density="compact"
        :items="possible_variants.map((v) => v.name)"
        v-model="selected_variant_name"/>
  </div>
  <VuePlotly :data="plot_data" :layout="layout" class="plot" v-if="has_possible_variants"/>
  <ErrorFrame v-else header="No OA data" type="dark">
    <template v-slot:message>
      <p>I couldn't find any Hydrograph files to create this plot.
        <br>Possible files would have been:
      </p>
      <ul>
        {{ has_possible_variants }}
        <li v-for="variant in HydrographVariants" :key="variant.name">{{variant.file}}</li>
      </ul>
    </template>
  </ErrorFrame>
</template>

<style scoped>
  .plot {
    width: 100%;
    height: 100%;
  }
  .select{
    position: absolute;
    display: block;
    max-width: 50%;
    width: max-content;
    margin-right: 4em;
    top: 0px;
    left: 0px;
    z-index: 10;
  }

</style>
<style>
  .v-combobox .v-combobox__selection-text {
    text-overflow: ellipsis;
    /* overflow: visible; */
    overflow-inline: visible;
    inset-inline: 1em;
  }
  .plotly .modebar{
    right: 3.5em!important;
    max-width: calc(50% - 3.5em);
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: flex-end;
    flex-direction: row;
    /* flex-flow: row-reverse wrap-reverse; */
  }
</style>