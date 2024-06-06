<script setup>
  import { ref, onMounted } from 'vue'
  import { Modal } from 'bootstrap'

  import { plotsLibrary } from '~/components/plots/plotsLibrary'
  import { usePlotsLayout } from '~/stores/plotsLayout'

  const modal_dom = ref(null)
  var modal;
  onMounted(() => {
    let opts = {
      delay: { show: 500, hide: 150 },
      placement: 'bottom'
    }
    modal = new Modal(modal_dom.value, opts)
  })

  const layoutStore = usePlotsLayout()
  const layout = layoutStore.layout
  const colNum = layoutStore.colNum

  const selectedPlotKey = ref(plotsLibrary.lib[0].key)

  function addPlot() {
    // get free grid cells
    let rowNum = Math.floor(window.innerHeight/100);
    const allGrids = Array.from({length: rowNum}, (_, i) =>
        Array.from({length: colNum}, (_, j) => ({x: j, y: i}))
    ).flat();
    const occupiedGrids = layoutStore.layout.map((item) => Array.from(
      { length: item.h }, (_, i) =>
        Array.from({ length: item.w }, (_, j) => ({ x: j + item.x , y: i + item.y}))
      ).flat()).flat();
    let freeGrids = allGrids.filter((grid) =>
      !occupiedGrids.some((occupiedGrid) => occupiedGrid.x === grid.x && occupiedGrid.y === grid.y)
    );

    // add plot to free grid
    if (freeGrids.length === 0) {
      console.error('No free grids available');
      layout.push({
        x: (layout.length * 2) % (colNum.value || rowNum),
        y: layout.length + (colNum.value || rowNum), // puts it at the bottom
        w: Math.floor(colNum/2),
        h: Math.floor(rowNum/2),
        i: layout.length + 1,
        plotKey: selectedPlotKey.value
      })
    } else {
      let w = 0;
      let h = 0;
      let x0 = freeGrids[0].x;
      let y0 = freeGrids[0].y;
      let first_line = true;
      let prev_x = x0;
      for (var grid of freeGrids) {
        // check the first line of free grids to determine the width of the plot
        if (first_line) {
          if (grid.x > prev_x || (grid.x == x0 && grid.y == y0)) {
            w++;
          } else {
            first_line = false;
          }
        }
        // check the possible height of the plot
        if (!first_line) {
          if (prev_x >= grid.x) {
            if (prev_x >= (x0 + w - 1)) {
              h++;
            } else {
              break
            }
          }
        }
        prev_x = grid.x;
      }
      layout.push({
        x: x0,
        y: y0,
        w: Math.min(Math.ceil(colNum/2), Math.max(w, 3)),
        h: Math.min(rowNum, Math.max(h, 3)),
        i: layout.map((item) => item.i).reduce((a, b) => Math.max(a, b), 0) + 1,
        plotKey: selectedPlotKey.value
      })
    }
    modal.hide()
  }

</script>

<template>
  <a id="AddPlotButton" type="button" data-bs-toggle="modal" data-bs-target="#addPlotModal">
    <i class="bi bi-plus-square" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Add a new plot"></i>
  </a>
  <div class="modal fade" id="addPlotModal" aria-hidden="true" aria-labelledby="AddPlotModalButton" tabindex="-1" ref="modal_dom">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addPlotModalLabel">Add a Plot Window</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <span class="input-group-text">Select a Plot</span>
            <select class="form-select" id="plotSelect" v-model="selectedPlotKey">
              <option v-for="plot in plotsLibrary.lib" :key="plot.key" :value="plot.key">{{ plot.label }}</option>
            </select>
            <button class="btn btn-primary" @click="addPlot">Add Plot</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  a#AddPlotButton {
    float: right;
    margin-left: 1rem;
    color: black;
    font-size: x-large;
  }
  a#AddPlotButton:hover{
    opacity: 1;
    color: var(--bs-primary);
  }
</style>
