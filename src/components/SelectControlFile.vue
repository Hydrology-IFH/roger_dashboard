<script setup>
  import { useControlFiles } from '../stores/controlFiles'
  import IconOpen from './icons/IconOpen.vue'
  import { watchEffect } from 'vue'

  const cf_store = useControlFiles()
  watchEffect(() => {
    console.log(cf_store.active_control_file)
    if (!cf_store.last_control_files.includes(cf_store.active_control_file)) {
      cf_store.last_control_files.push(cf_store.active_control_file)
      if (cf_store.last_control_files.includes(null)) {
        cf_store.last_control_files.splice(cf_store.last_control_files.indexOf(null),1)
      }
    }
  })

  function onNewSelect(e) {
    console.log(e.target.files[0])
    cf_store.active_control_file = e.target.files[0].path
  }
  function onClickOpenSelect(e) {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById('formFile').click()
  }
  window.cf_store = cf_store
</script>

<template>
  <div class="SelectControlFile" id="SelectControlFile">
    <form action="none">
      <input class="form-control" type="file" id="formFile" v-on:change="onNewSelect" hidden>
      <div class="form-group input-group mb-3">
        <span class="input-group-text" :id="`label_Select${id}`"
            data-bs-toggle="tooltip" data-bs-placement="top"
            data-bs-title="Select a RoGeR control file">
          Control File
        </span>
        <select class="form-select form-control" :name="`Select${id}`" :id="`Select${id}`"
          v-model="cf_store.active_control_file">
          <option v-for="option in cf_store.last_control_files" :key="option" :value="option" :active="option === cf_store.active_control_file">{{ option }}</option>
        </select>
        <button class="input-group-text" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Open a new RoGeR control file" v-on:click="onClickOpenSelect">
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
  }
</style>