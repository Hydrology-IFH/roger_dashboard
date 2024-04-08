<script setup>
  import { onMounted } from 'vue'
  import { Tooltip } from 'bootstrap';

  const sel_var = defineModel({ required: true })
  const props = defineProps({
    sel_options: [String],
    name: String,
    tooltipMsg: String
  })
  const id = props.name.replace(/\s/g, '_')

  onMounted(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))
  })
</script>

<template>
  <div class="form-group input-group mb-3">
    <span class="input-group-text" :id="`label_Select${id}`"
    data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name }}
    </span>
    <!-- <span class="form-control"> -->
      <select class="form-select form-control" :name="`Select${id}`" :id="`Select${id}`"
        v-model="sel_var">
        <option v-for="option in sel_options" :key="option" :value="option" :active="option === sel_var">{{ option }}</option>
      </select>
    <!-- </span> -->
  </div>
</template>

<style scoped>
  .form-group {
    max-width: 300px;
  }
</style>