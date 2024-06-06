<script setup>
  import { watchEffect, ref, onMounted } from 'vue'
  import { Tooltip } from 'bootstrap'

  import { useControlFiles } from '../stores/controlFiles'
  import { useControlFile } from '../stores/controlFile'
  import IconOpen from './icons/IconOpen.vue'

  const cfs_stores = useControlFiles()
  const input_dom = ref(null)
  const select_dom = ref(null)
  const btn_dom = ref(null)
  let btn_tooltip = null

  const cf_store = useControlFile()
  watchEffect(() => {
    if (cfs_stores.active_control_file) {
      cf_store.loadControlFile(cfs_stores.active_control_file.file)
    }
  })
  onMounted(() => {
    let opts = {
      delay: { show: 500, hide: 150 },
      placement: 'bottom'
    }
    new Tooltip(select_dom.value, opts)
    btn_tooltip = new Tooltip(btn_dom.value, opts)
  })
  function onClickOpenSelect(e) {
    e.preventDefault()
    btn_tooltip.hide()
    input_dom.value.click()
  }
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
          v-model="cfs_stores.active_control_file" v-if="cfs_stores.last_control_files.length>0">
          <option v-for="cf in cfs_stores.last_control_files" :key="cf.file" :value="cf" :active="cf === cfs_stores.active_control_file">
            &lrm;{{ cf.file }}
          </option>
        </select>
        <span class="form-select form-control" v-else>No control file selected</span>
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