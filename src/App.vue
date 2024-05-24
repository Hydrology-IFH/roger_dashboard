<script setup>
  import OATimeseriePlot from './components/OATimeseriePlot.vue'
  import MapPlot from './components/map/MapPlot.vue'
  import SettingsForm from './components/SettingsForm.vue'
  import SelectControlFile from './components/SelectControlFile.vue'
</script>

<template>
  <SettingsForm />
  <div class="d-flex flex-wrap flex-md-nowrap align-items-end">
      <div >
        <h1 id="heading" class="pe-2" style="text-wrap: nowrap">RoGeR result dashboard</h1>
      </div>
      <div class="ms-auto">
        <SelectControlFile />
      </div>
    </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-5 col-12">
        <OATimeseriePlot />
      </div>
      <div class="col-lg-7 col-12">
        <MapPlot />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
