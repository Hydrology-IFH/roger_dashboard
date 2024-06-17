<script setup>
  import { GridLayout, GridItem } from 'grid-layout-plus'
  import { markRaw } from 'vue'

  import { plotsLibrary } from './plots/plotsLibrary'
  import { usePlotsLayout } from '~/stores/plotsLayout'
  import { useControlFile } from '~/stores/controlFile'
  import { useControlFiles } from '~/stores/controlFiles'
  import ErrorFrame from './utils/ErrorFrame.vue'

  // get layout
  const layoutStore = usePlotsLayout()
  const layout = layoutStore.layout
  const colNum = layoutStore.colNum

  // adding/removing plots functions
  function removePlot(item){
    layout.splice(layout.indexOf(item), 1)
  }
  function getPlotComponent(plotKey) {
    let plot = plotsLibrary.getPlot(plotKey)
    if (plot===undefined) {
      console.error(`Plot "${plotKey}" not found in plotsLibrary`)
      return
    }
    return markRaw(plot)
  }

  // check if control file is selected
  const controlFileStore = useControlFile()
  const controlFilesStore = useControlFiles()

</script>

<template>
  <GridLayout
    v-model:layout="layout"
    :col-num="colNum"
    :row-height="100"
    :margin="[7, 7]"
    is-draggable
    is-resizable
    use-css-transforms
    :prevent-collision="true"
    :vertical-compact="false"
    v-if="controlFileStore.cf_valid"
  >
    <GridItem
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :row-height="50"
        :resize-option="{edges: { right: true, bottom: true, bottomRight: true }}"
        drag-allow-from=".vue-draggable-handle"
        drag-ignore-from=".no-drag">
      <div class="vue-draggable-container">
        <div class="vue-draggable-bar text-body-emphasis">
          <i class="bi bi-arrows-move vue-draggable-handle"></i>
          <i class="bi bi-x-lg" v-on:click="removePlot(item)"></i>
        </div>
        <div class="no-drag">
          <component class="vue-drag-plot" :is="getPlotComponent(item.plotKey)"/>
        </div>
      </div>
    </GridItem>
  </GridLayout>
  <ErrorFrame v-else-if="controlFilesStore.active == null"
      msg="Please first select a RoGeR control file to show the results."
      header="No control file got selected"
      type="warning"/>
  <ErrorFrame v-else
    msg="Please select a valid RoGeR controlfile to show the results"
    header="The selected control file is not valid"
     />
</template>

<style scoped>
  :deep(.vgl-item:not(.vgl-item--placeholder)) {
    background-color: #d8d8d86b;
    border: 1px solid black;
  }

  :deep(.vgl-item--resizing) {
    opacity: 90%;
  }

  .vue-draggable-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: auto;
  }

  .vgl-item .no-drag {
    width: 100%;
    height: 100%;
  }

  .vue-draggable-bar{
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 0;
    right: 0;
    max-width: 100%;
    width: max-content;
    height: max-content;
    background-color: white;
    z-index: 1;
    border-bottom: #000 1px solid;
    border-left:#000 1px solid;
    border-bottom-left-radius: 5px;
    font-size: large;
  }
  .vue-draggable-bar i{
    padding-left: 3px;
    padding-right: 3px;
  }
  .vue-draggable-bar i.bi-arrows-move:hover{
    cursor: move;
  }
  .vue-draggable-bar i.bi-x-lg{
    cursor: pointer;
  }
  .vue-draggable-bar i:hover{
    color: var(--bs-primary);
  }

  a#AddPlotButton {
    float: right;
    margin-left: 1rem;
    margin-top: 4px;
    color: black;
  }
  a#AddPlotButton:hover{
    opacity: 1;
    color: var(--bs-primary);
  }
</style>
