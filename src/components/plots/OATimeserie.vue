<script setup>
  import { ref, watchEffect, computed } from 'vue'
  import { VuePlotly } from 'vue3-plotly'
  import { parse as csvparse } from 'csv-parse/browser/esm/sync';

  import { useSettings } from '../../stores/settings'
  import { useControlFile } from '../../stores/controlFile'
  import ErrorFrame from './utils/ErrorFrame.vue'

  const settings = useSettings()
  const control_file = useControlFile()
  window.control_file = control_file
  const FILEPATH = "RoGeR_\\Ergebnisse\\OA_zeitlich.csv"

  // load data from file
  const oa_ts_data = ref({
    N: [],
    OA: [],
    timestep: []
  })
  watchEffect(async () => {
    let oa_file = window.nodePath.join(control_file.output_folder, FILEPATH);
    if (control_file.output_files.includes(FILEPATH)) {
      let dec = settings.timeseries_decimals
      window.electron.ipcRenderer.invoke("get-file-text", oa_file)
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
    } else {
      oa_ts_data.value = {
        N: [],
        OA: [],
        timestep: []
      }
    }

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
  <div class="plot" id="oa-plot" v-if="oa_ts_data.N.length>0">
    <VuePlotly :data :layout />
  </div>
  <ErrorFrame v-else :msg="`I couldn't find an OA timeseries file (${FILEPATH}) in the output folder`" header="No OA data" type="dark"/>
</template>

<style scoped>
  .plot {
    width: 100%;
    height: 100%;
  }
</style>