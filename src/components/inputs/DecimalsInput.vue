<script setup>
  import { onMounted } from 'vue'
  import { Tooltip } from 'bootstrap';

  const decimals = defineModel({ required: true })

  onMounted(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))
  })
</script>

<template>
  <div class="form-group input-group mb-3">
    <span class="input-group-text" id="label_SliderDecimals"
        data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-title="Select the number of decimals to round the data to">
      Decimals
    </span>
    <span class="form-control">
      <input type="range" class="form-range" name="SliderDecimals" id="SliderDecimals" min="0" max="6"
        v-model.number="decimals"/>
    </span>
    <input type="number" class="form-control" name="SliderDecimalsNumber" min="0" max="6"
      v-model.number="decimals" style="max-width:70px" />
  </div>
</template>

<style scoped>
  .form-group {
    max-width: 300px;
  }
</style>