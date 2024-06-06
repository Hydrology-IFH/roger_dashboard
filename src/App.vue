<script setup>
  import { onMounted } from 'vue'
  import { Tooltip } from 'bootstrap';

  import SettingsForm from './components/SettingsForm.vue'
  import SelectControlFile from './components/SelectControlFile.vue'
  import PlotsArea from './components/PlotsArea.vue'
  import PlotCatalog from './components/PlotCatalog.vue'


  onMounted(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl, { delay: { show: 1000, hide: 150 }}))
  })
</script>

<template>
  <div class="header">
    <SettingsForm />
    <PlotCatalog />
    <div class="d-flex flex-wrap flex-md-nowrap align-items-end">
      <div >
        <h1 id="heading" class="pe-2" style="text-wrap: nowrap">RoGeR result dashboard</h1>
      </div>
      <div class="ms-auto">
        <SelectControlFile />
      </div>
    </div>
  </div>
  <div class="body">
    <PlotsArea />
  </div>
  <notifications position="bottom right" :duration="10000" :max="5" :pauseOnHover="true"/>
</template>

<style>
  .vue-notification .notification-content{
    font-size: 1rem;
    overflow-wrap: break-word;
  }
  .header {
    position: absolute;
    margin-right: 10px;
  }
  .body{
    margin-top: 3em;
    height: calc(100vh - 5em);
    overflow-y: auto;
    padding: 0px
  }
</style>
