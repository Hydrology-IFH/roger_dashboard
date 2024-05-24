<script setup>
  import { useSettings } from '../stores/settings'
  import IconGear from './icons/IconGear.vue'
  import DecimalsInput from './inputs/DecimalsInput.vue'
  import SelectInput from './inputs/SelectionInput.vue'
  import SettingsControlFile from './SettingsControlFile.vue'

  const settings = useSettings()

</script>

<template>
  <a id="OpenSettingsButton" type="button" data-bs-toggle="modal" data-bs-target="#settingsModal"><IconGear :size=24 /></a>

  <div class="modal fade" id="settingsModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="settingsModalLabel">Settings</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form action="none">
            <ul class="nav nav-tabs" id="SettingsTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="representation-tab" data-bs-toggle="tab" data-bs-target="#representation-tab-pane" type="button" role="tab" aria-controls="representation-tab-pane" aria-selected="true">Representation</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="map-tab" data-bs-toggle="tab" data-bs-target="#map-tab-pane" type="button" role="tab" aria-controls="map-tab-pane" aria-selected="false">Map Settings</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="control-file-tab" data-bs-toggle="tab" data-bs-target="#control-file-tab-pane" type="button" role="tab" aria-controls="control-file-tab-pane" aria-selected="false">Control File</button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="representation-tab-pane" role="tabpanel" aria-labelledby="representation-tab" tabindex="0">
                <DecimalsInput v-model="settings.timeseries_decimals" :min=0 :max=6 tooltipMsg="Select the number of decimals to round the data  in the timeseries plot" name="decimals on timeseries plot"/>
              </div>
              <div class="tab-pane fade" id="map-tab-pane" role="tabpanel" aria-labelledby="map-tab" tabindex="0">
                <p>Select the default map Settings. Those Settings are loaded on App startup.</p>
                <SelectInput name="Basemap" v-model="settings.map_default_basemap" :sel_options="['osm', 'basemap_color', 'basemap_grey']" tooltipMsg="The default basemap to use in the map"/>
                <SelectInput name="Colorscale" v-model="settings.map_default_colorscale" :sel_options="['inferno', 'viridis', 'plasma', 'magma']" tooltipMsg="The default colorscale to use in the map"/>
                <DecimalsInput v-model="settings.map_default_hover_decimals" :min=0 :max=6
                  name="Hover decimals"
                  tooltipMsg="Select the default number of decimals to round the hover label to."/>
                <DecimalsInput v-model="settings.map_default_opacity" :min=0 :max=100
                  name="Opacity"
                  tooltipMsg="Select the default opacity of the map"/>
              </div>
              <div class="tab-pane fade" id="control-file-tab-pane" role="tabpanel" aria-labelledby="control-file-tab" tabindex="0">
                <SettingsControlFile/>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .tab-content {
    padding-top: 1rem;
  }
  a#OpenSettingsButton {
    float: right;
    margin-left: 1rem;
    margin-top: 4px;
    color: black;
  }
  a#OpenSettingsButton:hover{
    opacity: 1;
    color: var(--bs-primary);
  }

</style>