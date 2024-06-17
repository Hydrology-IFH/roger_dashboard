<script setup>
  import { watchEffect, ref, onMounted, computed } from 'vue'
  import { Tooltip } from 'bootstrap'

  import { useControlFiles } from '../stores/controlFiles'
  import { useControlFile } from '../stores/controlFile'
  import IconOpen from './icons/IconOpen.vue'

  const cfs_stores = useControlFiles()
  const input_dom = ref(null)
  const select_dom = ref(null)
  const btn_dom = ref(null)
  let btn_tooltip = null

  // load control file on select
  const cf_store = useControlFile()
  watchEffect(() => {
    if (cfs_stores.active) {
      cf_store.loadControlFile(cfs_stores.active.file)
    }
  })

  // click handlers
  function onClickOpenSelect(e) {
    e.preventDefault()
    btn_tooltip.hide()
    input_dom.value.click()
  }
  function onNewSelect(e) {
    let file = e.target.files[0]
    if (file) {
      cfs_stores.selectControlFile(file.path)
    }
  }

  // show/hide archive
  const showArchive = computed(() => cfs_stores.archive.length > 0)

  //  Tooltips
  const tltp_opts = {
    delay: { show: 500, hide: 150 },
    placement: 'bottom'
  }
  onMounted(() => {
    btn_tooltip = new Tooltip(btn_dom.value, tltp_opts)

    watchEffect(() => {
      if (showArchive.value) {
        new Tooltip(select_dom.value, tltp_opts)
      }
    })
  })
</script>

<template>
  <div class="SelectControlFile" id="SelectControlFile">
    <form action="none">
      <input class="form-control" type="file" id="Select_Control_file_formFile" v-on:change="onNewSelect" hidden ref="input_dom">
      <div class="form-group input-group mb-3">
        <span class="input-group-text" id="label_Select_Control_file">
          Control File
        </span>
        <select class="form-select form-control" name="Select_Control_file" id="Select_Control_file" ref="select_dom"
          data-bs-toggle="tooltip" data-bs-title="Select one of the previously selected RoGeR control files"
          v-model="cfs_stores.active" :hidden="!showArchive">
          <option v-for="cf in cfs_stores.archive_ordered" :key="cf.file" :value="cf" :active="cf === cfs_stores.active">
            &lrm;{{ cf.file }}
          </option>
        </select>
        <span class="form-select form-control" :hidden="showArchive">No control file selected</span>
        <button class="input-group-text" ref="btn_dom"
          data-bs-toggle="tooltip" data-bs-title="Open a new RoGeR control file"
          v-on:click="onClickOpenSelect">
          <IconOpen :size=20 />
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .tab-content {
    padding-top: 1rem;
  }
  a#OpenSelectControlFileButton {
    position: absolute;
    top: 2rem;
    right: calc(2rem + 24px + .5rem);
    color: black;
  }
  a#OpenSelectControlFileButton:hover{
    opacity: 1;
    color: var(--bs-primary);
  }
  select{
    text-overflow: ellipsis;
    direction: rtl;
    text-align: end;
  }
</style>