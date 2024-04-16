<script setup>
  import { onMounted } from 'vue'
  import { Tooltip } from 'bootstrap';

  const decimals = defineModel({ required: true })
  defineProps({
    name: String,
    tooltipMsg: String,
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 6
    }
  })

  onMounted(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))
  })
</script>

<template>
  <div class="form-group input-group mb-3">
    <span class="input-group-text" id="label_SliderDecimals"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name}}
    </span>
    <span class="form-control">
      <input type="range" class="form-range" name="SliderDecimals" id="SliderDecimals" :min="min" :max="max"
        v-model.number="decimals"/>
    </span>
    <input type="number" class="form-control" name="SliderDecimalsNumber" :min="min" :max="max"
      v-model.number="decimals" style="max-width:70px" />
  </div>
</template>

<style scoped>
  .form-group {
    max-width: 300px;
  }
</style>