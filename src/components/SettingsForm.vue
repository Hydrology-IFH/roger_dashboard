<script setup>
  import { ref, onMounted } from 'vue'
  import { Tooltip } from 'bootstrap'
  import { useNotification } from "@kyvg/vue3-notification";

  import { useSettings } from '~/stores/settings'
  import { usePlotsLayout } from '~/stores/plotsLayout'
  import DecimalsInput from './inputs/DecimalsInput.vue'
  import SelectInput from './inputs/SelectionInput.vue'
  import SettingsControlFile from './SettingsControlFile.vue'
  import SwitchInput from './inputs/SwitchInput.vue'

  const settings = useSettings()
  const layoutStore = usePlotsLayout()
  // const layoutStoreDefault = usePlotsLayoutDefault()
  const {notify} = useNotification()

  // Tooltips
  const btn_dom = ref(null)
  const btnSavePlotLayout = ref(null)
  const btnResetPlotLayout = ref(null)
  const spanPlotLayout = ref(null)
  onMounted(() => {
    let opts = {
      delay: { show: 500, hide: 150 },
      placement: 'top'
    }
    new Tooltip(btn_dom.value, opts)
    new Tooltip(spanPlotLayout.value, opts)
    new Tooltip(btnSavePlotLayout.value, opts)
    new Tooltip(btnResetPlotLayout.value, opts)
  })

  // plotView functions
  function savePlotLayout() {
    layoutStore.setActualLayoutAsDefault()
    notify({
      type: "success",
      title: "Default plot layout saved",
      text: "The actual view got saved as default"
    })
  }
  function resetPlotLayout() {
    layoutStore.resetDefaultLayout()
    notify({
      type: "success",
      title: "Default plot layout reset",
      text: "The default plot layout got reset to the initial value"
    })
  }

</script>

<template>
  <a id="OpenSettingsButton" type="button" data-bs-toggle="modal" data-bs-target="#settingsModal">
    <i class="bi bi-gear" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Settings" ref="btn_dom"></i>
  </a>
  <Teleport to="body">
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
                  <button class="nav-link" id="map-tab" data-bs-toggle="tab" data-bs-target="#map-tab-pane" type="button" role="tab" aria-controls="map-tab-pane" aria-selected="false">Map Defaults</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="control-file-tab" data-bs-toggle="tab" data-bs-target="#control-file-tab-pane" type="button" role="tab" aria-controls="control-file-tab-pane" aria-selected="false">Control File</button>
                </li>
              </ul>
              <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="representation-tab-pane" role="tabpanel" aria-labelledby="representation-tab" tabindex="0">
                  <p>Select the default representation Settings. Those Settings are loaded on App startup.</p>

                  <div class="input-group mb-3">
                    <span class="input-group-text" id="label_PlotLayout" ref="spanPlotLayout"
                          data-bs-toggle="tooltip"
                          data-bs-title="reset or save the actual default plot layout; The plots, theire position and size at startup.">
                      default plot layout
                    </span>
                    <button class="btn btn-primary" ref="btnSavePlotLayout" @click.prevent="savePlotLayout"
                            data-bs-toggle="tooltip" data-bs-title="save the actual view as default">
                        <i class="bi bi-floppy" ></i> Save
                    </button>
                    <button class="btn btn-outline-primary" ref="btnResetPlotLayout" @click.prevent="resetPlotLayout"
                            data-bs-toggle="tooltip" data-bs-title="reset the default plot layout to the default value">
                      <i class="bi bi-arrow-clockwise" ></i> Reset
                    </button>
                  </div>

                  <DecimalsInput v-model="settings.timeseries_decimals" :min=0 :max=6 tooltipMsg="Select the number of decimals to round the data  in the timeseries plot" name="decimals on timeseries plot"/>
                </div>
                <div class="tab-pane fade" id="map-tab-pane" role="tabpanel" aria-labelledby="map-tab" tabindex="0">
                  <p>Select the default map Settings. Those Settings are loaded on App startup.</p>
                  <SelectInput name="Basemap" v-model="settings.map_default_basemap" :sel_options="['osm', 'basemap_color', 'basemap_grey', 'blank']" tooltipMsg="The default basemap to use in the map"/>
                  <SelectInput name="Colorscale" v-model="settings.map_default_colorscale" :sel_options="['inferno', 'viridis', 'plasma', 'magma']" tooltipMsg="The default colorscale to use in the map"/>
                  <SwitchInput name="reverse the Colorscale" v-model="settings.map_default_colorscale_reverse" tooltipMsg="Should the colorscale be reversed by default"/>
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
  </Teleport>
</template>

<style scoped>
  .tab-content {
    padding-top: 1rem;
  }
  a#OpenSettingsButton {
    float: right;
    margin-left: 1rem;
    color: black;
    font-size: x-large;
  }
  a#OpenSettingsButton:hover{
    opacity: 1;
    color: var(--bs-primary);
  }

</style>