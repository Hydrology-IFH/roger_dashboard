<script setup>
  import { onMounted } from 'vue'
  import { Tooltip } from 'bootstrap';

  const path = defineModel({ required: true })
  const full_path = defineModel("full_path", { required: false })
  defineProps({
    name: String,
    tooltipMsg: String
  })

  onMounted(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))
  })
</script>

<template>
  <div class="form-group input-group mb-3">
    <span class="input-group-text" :id="`label_${name}`"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name }}
    </span>
    <input type="text" class="form-control" :name="`input_${name}`" :id="`input_${name}`" v-model="path"/>
    <span class="input-group-text" v-if="full_path"
      data-bs-toggle="tooltip" data-bs-placement="top"
      data-bs-title="As this setting is a sub path, it is combined with other path settings to become the full path displayed here">
      {{full_path}}
    </span>
  </div>
</template>

<style scoped>
  div.form-group > span.input-group-text:first-of-type {
    max-width: 300px;
    min-width: 210px;
  }
</style>