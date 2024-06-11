<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { Tooltip } from 'bootstrap';
  import { get_reasonable_digits } from '../utils/reasonable_digits'

  const range = defineModel({required: true})
  const props = defineProps({
    name: String,
    min: {Number, default: 0},
    max: {Number, default: 100},
    tooltipMsg: String,
  })

  const digits = computed(() => get_reasonable_digits(props.min, props.max))
  const step = computed(() => Math.pow(10, -digits.value))
  const id = props.name.replace(/\s/g, '_')
  const label_dom = ref(null)
  const minr = computed(() => Math.floor(props.min * Math.pow(10, digits.value)) / Math.pow(10, digits.value))
  const maxr = computed(() => Math.ceil(props.max * Math.pow(10, digits.value)) / Math.pow(10, digits.value))

  onMounted(() => {
    new Tooltip(label_dom.value)
  })
</script>

<template>
  <div class="input-group input-group-vertical mb-3">
    <span class="input-group-text" :id="`label_RangeInput_${id}`" ref="label_dom"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name }}
    </span>
    <div class="input-group">
      <input type="number" class="form-control no-arrows" :min="minr" :max="maxr" :step="step"
        v-model.number="range.value[0]" style="max-width:70px" />
      <v-range-slider class="form-control" v-model="range.value" :min="minr" :max="maxr" :step="step"
        hide-details thumb-label="always" color="var(--bs-primary)"
      ></v-range-slider>
      <input type="number" class="form-control no-arrows" :min="minr" :max="maxr"
        v-model.number="range.value[1]" style="max-width:70px" />
    </div>
  </div>
</template>

<style scoped>
  .input-group input[type="range"] {
    max-width: 400px;
  }
  .input-group-vertical{
    max-width: 400px;
    flex-direction: column;
  }
  .input-group-vertical>.input-group-text{
    width: 100%;
    border-radius: 0px!important;
    justify-content: center;
    border-top-right-radius: var(--bs-border-radius)!important;
    border-top-left-radius: var(--bs-border-radius)!important;
    border-bottom: 0px;
  }
  .input-group-vertical>.input-group{
    display: flex;
    flex-direction: row;
    width:100%;
    flex-wrap: nowrap;
    border-top: 0px;
    margin-left: 0px!important;
  }
  .input-group-vertical>.input-group>:first-child{
    border-top-left-radius: 0px;
  }
  .input-group-vertical>.input-group>:last-child{
    border-top-right-radius: 0px;
  }
  input.no-arrows::-webkit-outer-spin-button,
  input.no-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input.no-arrows {
    width: 6em;
    text-align: center;
  }
  .v-input{
    padding-right: -8px;
  }

</style>
<style>
.v-slider-thumb__label{
  transform: rotate(180deg) translateX(100%) translateY(-250%) translateX(-50%)!important;
}
.v-slider-thumb__label>div{
  transform: rotate(180deg)!important;
}
</style>