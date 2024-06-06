<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    layer_lib: Object,
    group_lib: Object,
  })

  const has_groups = computed(() => props.group_lib.groups.length > 0)
  const has_layers = computed(() => props.group_lib.layers.length > 0)
  const is_child = computed(() => props.group_lib === props.layer_lib)

</script>

<template>
  <div class="list-group" v-if="has_layers" :class="{ 'has_groups': has_groups, 'is_child': is_child}">
    <a href="#" class="list-group-item list-group-item-action"
      v-for="layer in group_lib.layers" :key="layer.id"
      @click="props.layer_lib.selectLayer(layer)"
      :class="{ active: layer.selected }">
      {{ layer.name }}
    </a>
  </div>
  <div class="accordion" :id="`accordionLayerSelection-${group_lib.id}`" v-if="has_groups" :class="{'has_layers': has_layers, 'is_child': props.is_child}">
    <div class="accordion-item" v-for="group in group_lib.groups" :key="group">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :class="{ active: group.selected }"
          :data-bs-target="`#collapse-${group.id}`" aria-expanded="false" :aria-controls="`collapse-${group.id}`">
          {{ group.name }}
        </button>
      </h2>
      <div :id="`collapse-${group.id}`" class="accordion-collapse collapse" :data-bs-parent="`#accordionLayerSelection-${group_lib.id}`">
        <div class="accordion-body">
          <LayerSelection :layer_lib="layer_lib" :group_lib="group"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .accordion-body{
    padding-right: 0px;
    padding-left: 1rem;;
  }
  .accordion.is_child > .accordion-item:first-of-type {
    border-top-right-radius: 0px;
  }
  .accordion.is_child > .accordion-item:first-of-type > .accordion-header > .accordion-button{
    border-top-right-radius: 0px;
  }
  div.accordion.has_layers > .accordion-item:first-of-type > .accordion-header > .accordion-button{
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }
  div.accordion.has_layers > .accordion-item:first-of-type{
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }
  div.list-group.has_groups{
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
</style>
<style>


</style>