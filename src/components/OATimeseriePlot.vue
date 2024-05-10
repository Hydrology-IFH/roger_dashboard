<script setup>
  import { useSettings } from '../stores/settings'
  import { ref, watchEffect, computed } from 'vue'
  import { VuePlotly } from 'vue3-plotly'
  import { parse as csvparse } from 'csv-parse/browser/esm/sync';

  const settings = useSettings()

  // load data from file
  const oa_ts_data = ref({
    N: [],
    OA: [],
    timestep: []
  })
  watchEffect(async () => {
    let dec = settings.timeseries_decimals
    fetch(settings.roger_oa_ts_file)
      .then(response => response.text())
      .catch(err => console.error(err))
      .then(text => {
        let csv_data = csvparse(text, { delimiter: ";", columns: true })
        oa_ts_data.value = {
          N: csv_data.map((data) => Math.round(parseFloat(data["N(mm)"])*10**dec)/10**dec),
          OA: csv_data.map((data) => Math.round(parseFloat(data["OA(mm)"])*10**dec)/10**dec),
          timestep: Array.from(csv_data, (v,i)=>i+1)
        }
      })
      .catch(err => console.error(err))
  })

  // plotly setup
  const layout = ref({
    title: 'OAMap',
    xaxis: {
      title: 'timestep [-]',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'mm',
      showline: false
    }
  })

  const data = computed(() => {
    return [{
      x: oa_ts_data.value["timestep"],
      y: oa_ts_data.value["N"],
      type: 'bar',
      mode: 'lines+points',
      marker: { color: 'blue' },
      name: 'N'
    },
    {
      x: oa_ts_data.value["timestep"],
      y: oa_ts_data.value["OA"],
      type: 'scatter',
      mode: 'lines',
      marker: { color: 'red' },
      name: 'OA'
    }
    ]
  })
</script>

<template>
  <div class="plot" id="oa-plot">
    <VuePlotly :data :layout/>
  </div>
</template>

<style scoped>
  .plot {
    width: 100%;
    height: 100%;
    min-width: 400px;
    min-height: 400px;
  }
</style>