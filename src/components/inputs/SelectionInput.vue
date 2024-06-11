<script setup>
  import { onMounted, ref } from 'vue'
  import { Tooltip } from 'bootstrap';

  const sel_var = defineModel({ required: true })
  const props = defineProps({
    sel_options: Array[String],
    name: String,
    tooltipMsg: String
  })
  const id = props.name.replace(/\s/g, '_')
  const label_dom = ref(null)

  onMounted(() => {
    new Tooltip(label_dom.value)
  })
</script>

<template>
  <div class="input-group mb-3">
    <span class="input-group-text" :id="`label_Select${id}`"
        ref="label_dom"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name }}
    </span>
    <select class="form-select form-control" :name="`Select${id}`" :id="`Select${id}`"
      v-model="sel_var">
      <option v-for="option in sel_options" :key="option" :value="option" :active="option === sel_var">{{ option }}</option>
    </select>
  </div>
</template>

<style scoped>
</style>