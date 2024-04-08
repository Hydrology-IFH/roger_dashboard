<script setup>
  import OATimeseriePlot from './components/OATimeseriePlot.vue'
  import OAMapPlot from './components/map/OAMapPlot.vue'
  import SettingsForm from './components/SettingsForm.vue'
</script>

<template>
  <SettingsForm />
  <div class="container-fluid">
    <h1>RoGeR result dashboard</h1>
    <div class="row">
      <div class="col-md-5 col-12">
        <OATimeseriePlot />
      </div>
      <div class="col-md-7 col-12">
        <OAMapPlot />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
