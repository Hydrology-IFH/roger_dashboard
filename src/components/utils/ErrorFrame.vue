<script setup>
  defineProps({
    msg: String,
    type: {
      type: String,
      default: 'danger'
    },
    header: {
      type: String,
      default: 'Error'
    }
  })
</script>
<template>
  <div class="ErrorFrame" id="ErrorFrame">
    <div class="alert" :class="`alert-${type}`" role="alert">
      <h4 class="alert-heading">{{ header }}</h4>
      <p>{{ msg }}</p>
    </div>
  </div>
</template>
