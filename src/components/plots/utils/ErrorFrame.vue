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

<style scoped>
  .ErrorFrame {
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
    padding: 1em;
  }
</style>
